import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  CreateUserDto,
  UpdateUserByUserDto,
  UserQuantitiesDto,
  LastWeekDto,
  UpdateUserByOwnerDto,
  DeletedUserDto,
} from '../dtos';
import { User } from '../entities';
import { hash } from 'bcryptjs';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { RabbitMqServices, UserRoles, UpdatedUserPartialObj } from '../types';
import { RabbitmqService } from './rabbitmq.service';
import { UserListFiltersDto } from 'src/dtos/userListFilters.dto';
import { DeletedUserListFiltersDto } from 'src/dtos/deletedUserListFilters.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(RabbitMqServices.USER) private readonly clientProxy: ClientProxy,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(payload: CreateUserDto, user: User): Promise<User> {
    let findedUser = await this.findByEmailWithDeleted(payload.email);

    if (findedUser) throw new ConflictException('The user already exist.');

    payload.password = await hash(payload.password, 10);
    let newUser = this.userRepository.create(payload);
    newUser.parent = user;
    newUser = await this.userRepository.save(newUser);
    await this.clientProxy
      .emit('created_user', { currentUser: user, createdUser: newUser })
      .toPromise();
    return newUser;
  }

  updateByUser(payload: UpdateUserByUserDto, currentUser: User): Promise<User> {
    return this.updateSameUser(payload, currentUser);
  }

  updateByOwner(
    payload: UpdateUserByOwnerDto,
    currentUser: User,
  ): Promise<User> {
    if (payload.id === currentUser.id)
      return this.updateSameUser(payload, currentUser);
    return this.findByIdAndUpdate(payload, currentUser);
  }

  async updateSameUser(
    payload: UpdatedUserPartialObj,
    user: User,
  ): Promise<User> {
    return this.update(payload, user, user);
  }

  async findByIdAndUpdate(
    payload: UpdatedUserPartialObj,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findByIdOrFail(payload.id);
    return this.update(payload, user, currentUser);
  }

  async updatePartialForMicroservices(
    payload: UpdatedUserPartialObj,
    context: RmqContext,
  ): Promise<User> {
    try {
      const user = await this.findByIdOrFail(payload.id);
      const updatedUser = await this.updateSameUser(payload, user);
      this.rabbitmqService.applyAcknowledgment(context);
      return updatedUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(
    payload: UpdatedUserPartialObj,
    user: User,
    currentUser: User,
  ): Promise<User> {
    if (payload.email) {
      let findedUser = await this.userRepository
        .createQueryBuilder('user')
        .withDeleted()
        .where('user.id != :userId')
        .andWhere('user.email = :userEmail')
        .setParameters({ userId: payload.id, userEmail: payload.email })
        .getOne();
      if (findedUser) throw new ConflictException('The user already exist.');
    }

    user.updatedAt = new Date();
    user = this.userRepository.create(Object.assign(user, payload));
    user = await this.userRepository.save(user);
    await this.clientProxy
      .emit('updated_user', { currentUser, updatedUser: user })
      .toPromise();
    return user;
  }

  async delete(id: number, currentUser: User): Promise<User> {
    const user = await this.findByIdOrFail(id);
    await this.userRepository.softRemove(user);
    await this.clientProxy
      .emit('deleted_user', { currentUser, deletedUser: user })
      .toPromise();
    return user;
  }

  async findOne(id: number): Promise<User> {
    return this.findByIdOrFail(id);
  }

  findById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  findByIdOrFail(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id')
      .setParameters({ id })
      .getOneOrFail();
  }

  async findByIdForMicroservices(
    id: number,
    context: RmqContext,
  ): Promise<User> {
    try {
      const user = await this.findByIdOrFail(id);
      this.rabbitmqService.applyAcknowledgment(context);
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  findByEmailWithDeleted(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByEmailForMicroservices(
    email: string,
    context: RmqContext,
  ): Promise<User> {
    try {
      const user = await this.findByEmail(email);
      if (!user) throw new NotFoundException('Could not found the user');
      this.rabbitmqService.applyAcknowledgment(context);
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  findAll(
    page: number,
    take: number,
    filters: UserListFiltersDto,
  ): Promise<[User[], number]> {
    return this.userRepository
      .createQueryBuilder('user')
      .take(take)
      .skip((page - 1) * take)
      .orderBy('user.createdAt', 'DESC')
      .where(
        new Brackets((query) =>
          query
            .where('to_tsvector(user.firstName) @@ plainto_tsquery(:q)')
            .orWhere('to_tsvector(user.lastName) @@ plainto_tsquery(:q)')
            .orWhere('to_tsvector(user.phone) @@ plainto_tsquery(:q)')
            .orWhere("user.firstName ILIKE '%' || :q || '%'")
            .orWhere("user.lastName ILIKE '%' || :q || '%'")
            .orWhere("user.phone ILIKE '%' || :q || '%'"),
        ),
      )
      .andWhere('user.role = ANY(:roles)')
      .andWhere(
        'CASE WHEN (:fromDate)::BIGINT > 0 THEN COALESCE(EXTRACT(EPOCH FROM date(user.createdAt)) * 1000, 0)::BIGINT >= (:fromDate)::BIGINT ELSE TRUE END',
      )
      .andWhere(
        'CASE WHEN (:toDate)::BIGINT > 0 THEN COALESCE(EXTRACT(EPOCH FROM date(user.createdAt)) * 1000, 0)::BIGINT <= (:toDate)::BIGINT ELSE TRUE END',
      )
      .setParameters({
        q: filters.q,
        roles: filters.roles,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      })
      .getManyAndCount();
  }

  getUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userRepository
      .createQueryBuilder('user')
      .select('COALESCE(COUNT(user.id), 0)::INTEGER', 'quantities')
      .addSelect(
        `COALESCE(SUM((user.role = :owner)::INTEGER), 0)::INTEGER`,
        'ownerQuantities',
      )
      .addSelect(
        `COALESCE(SUM((user.role = :admin)::INTEGER), 0)::INTEGER`,
        'adminQuantities',
      )
      .addSelect(
        `COALESCE(SUM((user.role = :user)::INTEGER), 0)::INTEGER`,
        'userQuantities',
      )
      .setParameters({
        owner: UserRoles.OWNER,
        admin: UserRoles.ADMIN,
        user: UserRoles.USER,
      })
      .getRawOne();
  }

  getDeletedUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userRepository
      .createQueryBuilder('user')
      .select('COALESCE(COUNT(user.id), 0)::INTEGER', 'quantities')
      .addSelect(
        `COALESCE(SUM((user.role = :owner)::INTEGER), 0)::INTEGER`,
        'ownerQuantities',
      )
      .addSelect(
        `COALESCE(SUM((user.role = :admin)::INTEGER), 0)::INTEGER`,
        'adminQuantities',
      )
      .addSelect(
        `COALESCE(SUM((user.role = :user)::INTEGER), 0)::INTEGER`,
        'userQuantities',
      )
      .withDeleted()
      .where('user.deletedAt IS NOT NULL')
      .setParameters({
        owner: UserRoles.OWNER,
        admin: UserRoles.ADMIN,
        user: UserRoles.USER,
      })
      .getRawOne();
  }

  lastWeekUsers(): Promise<LastWeekDto[]> {
    return this.userRepository.query(
      `
        WITH lastWeek (date) AS (
          VALUES
            (NOW()),
            (NOW() - INTERVAL '1 DAY'),
            (NOW() - INTERVAL '2 DAY'),
            (NOW() - INTERVAL '3 DAY'),
            (NOW() - INTERVAL '4 DAY'),
            (NOW() - INTERVAL '5 DAY'),
            (NOW() - INTERVAL '6 DAY')
        )
        SELECT
          COALESCE(EXTRACT(EPOCH FROM lastWeek.date) * 1000, 0)::BIGINT AS date,
          COUNT(public.user.created_at)::INTEGER as count
        FROM lastWeek
        FULL JOIN 
          public.user ON to_char(lastWeek.date, 'YYYY-MM-DD') = to_char(public.user.created_at, 'YYYY-MM-DD') AND 
          public.user.deleted_at IS NULL
        WHERE lastWeek.date IS NOT NULL
        GROUP BY lastWeek.date
        ORDER BY lastWeek.date ASC;
      `,
    );
  }

  findAllDeleted(
    page: number,
    take: number,
    filters: DeletedUserListFiltersDto,
  ): Promise<[User[], number]> {
    return this.userRepository
      .createQueryBuilder('user')
      .take(take)
      .skip((page - 1) * take)
      .withDeleted()
      .orderBy('user.deletedAt', 'DESC')
      .where('user.deletedAt IS NOT NULL')
      .andWhere(
        new Brackets((query) =>
          query
            .where('to_tsvector(user.firstName) @@ plainto_tsquery(:q)')
            .orWhere('to_tsvector(user.lastName) @@ plainto_tsquery(:q)')
            .orWhere('to_tsvector(user.phone) @@ plainto_tsquery(:q)')
            .orWhere("user.firstName ILIKE '%' || :q || '%'")
            .orWhere("user.lastName ILIKE '%' || :q || '%'")
            .orWhere("user.phone ILIKE '%' || :q || '%'"),
        ),
      )
      .andWhere('user.role = ANY(:roles)')
      .andWhere(
        'CASE WHEN (:fromDate)::BIGINT > 0 THEN COALESCE(EXTRACT(EPOCH FROM date(user.createdAt)) * 1000, 0)::BIGINT >= (:fromDate)::BIGINT ELSE TRUE END',
      )
      .andWhere(
        'CASE WHEN (:toDate)::BIGINT > 0 THEN COALESCE(EXTRACT(EPOCH FROM date(user.createdAt)) * 1000, 0)::BIGINT <= (:toDate)::BIGINT ELSE TRUE END',
      )
      .andWhere(
        'CASE WHEN (:deletedDate)::BIGINT > 0 THEN COALESCE(EXTRACT(EPOCH FROM date(user.deletedAt)) * 1000, 0)::BIGINT = (:deletedDate)::BIGINT ELSE TRUE END',
      )
      .setParameters({
        q: filters.q,
        roles: filters.roles,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        deletedDate: filters.deletedDate,
      })
      .getManyAndCount();
  }

  async findDeletedOne(id: number): Promise<DeletedUserDto> {
    const [response]: DeletedUserDto[] = await this.userRepository.query(
      `
        SELECT
          user1.id AS id,
          user1.first_name AS "firstName",
          user1.last_name AS "lastName",
          user1.email AS email,
          user1.phone AS phone,
          user1.role AS role,
          user1.created_by AS "createdBy",
          user1.created_at AS "createdAt",
          user1.updated_at AS "updatedAt",
          user1.deleted_at AS "deletedAt",
          json_build_object(
            'id', user2.id,
            'firstName', user2.first_name,
            'lastName', user2.last_name,
            'email', user2.email,
            'phone', user2.phone,
            'role', user2.role,
            'createdBy', user2.created_by,
            'createdAt', user2.created_at,
            'updatedAt', user2.updated_at,
            'deletedAt', user2.deleted_at
          ) AS parent
        FROM public.user AS user1
        LEFT JOIN public.user AS user2 ON user2.id = user1.created_by
        WHERE user1.id = $1 AND user1.deleted_at IS NOT NULL;
      `,
      [id],
    );

    if (!response) throw new NotFoundException('Could not found the user.');
    return response;
  }

  async restoreOne(id: number, user: User): Promise<User> {
    const restoredUser = await this.userRepository
      .createQueryBuilder('public.user')
      .restore()
      .where('public.user.id = :userId')
      .andWhere('public.user.deleted_at IS NOT NULL')
      .andWhere('public.user.created_by = :currentUserId')
      .setParameters({ userId: id, currentUserId: user.id })
      .returning('*')
      .exe();

    await this.clientProxy
      .emit('restored_user', {
        currentUser: user,
        restoredUser,
      })
      .toPromise();

    return restoredUser;
  }
}
