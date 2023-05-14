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
} from '../dtos';
import { User } from '../entities';
import { hash } from 'bcrypt';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { RabbitMqServices, UserRoles, UpdatedUserPartialObj } from '../types';
import { RabbitmqService } from './rabbitmq.service';
import { UserListFiltersDto } from 'src/dtos/userListFilters.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(RabbitMqServices.USER) private readonly clientProxy: ClientProxy,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    let user = await this.findByEmail(body.email);

    if (user) throw new ConflictException('The user already exist.');

    body.password = await hash(body.password, 10);
    user = this.userRepository.create(body);
    user = await this.userRepository.save(user);
    await this.clientProxy.emit('created_user', user).toPromise();
    return user;
  }

  async updateByUser(
    body: UpdateUserByUserDto,
    currentUser: User,
  ): Promise<User> {
    return this.update(body, currentUser);
  }

  async updateByOwner(
    body: UpdateUserByOwnerDto,
    currentUser: User,
  ): Promise<User> {
    if (body.id === currentUser.id) return this.update(body, currentUser);
    return this.update(body);
  }

  async updatePartialForMicroservices(
    payload: UpdatedUserPartialObj,
    context: RmqContext,
  ): Promise<User> {
    try {
      const udpatedUser = await this.update(payload);
      this.rabbitmqService.applyAcknowledgment(context);
      return udpatedUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(updatedUser: UpdatedUserPartialObj, user?: User) {
    if (!user) {
      user = await this.findById(updatedUser.id);
      if (!user) throw new NotFoundException('Could not found the user.');
    }

    if (updatedUser.email) {
      let findedUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id != :userId')
        .andWhere('user.email = :userEmail')
        .setParameters({ userId: updatedUser.id, userEmail: updatedUser.email })
        .getOne();
      if (findedUser) throw new ConflictException('The user already exist.');
    }

    user.updatedAt = new Date();
    user = this.userRepository.create(Object.assign(user, updatedUser));
    user = await this.userRepository.save(user);
    await this.clientProxy.emit('updated_user', user).toPromise();
    return user;
  }

  async delete(id: number): Promise<User> {
    let findedUser = await this.findById(id);

    if (!findedUser) throw new NotFoundException('Could not found the user.');

    await this.userRepository.delete(findedUser.id);
    await this.clientProxy.emit('deleted_user', findedUser).toPromise();
    return findedUser;
  }

  async findOne(id: number): Promise<User> {
    const findedUser = await this.findById(id);
    if (!findedUser) throw new NotFoundException('Could not found the user.');
    return findedUser;
  }

  findById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findByIdForMicroservices(
    id: number,
    context: RmqContext,
  ): Promise<User> {
    try {
      const user = await this.findById(id);
      this.rabbitmqService.applyAcknowledgment(context);
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByEmailForMicroservices(
    email: string,
    context: RmqContext,
  ): Promise<User> {
    try {
      const user = await this.findByEmail(email);
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

  async getUserQuantities(): Promise<UserQuantitiesDto> {
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

  async lastWeekUsers(): Promise<LastWeekDto[]> {
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
        FULL JOIN public.user ON to_char(lastWeek.date, 'YYYY-MM-DD') = to_char(public.user.created_at, 'YYYY-MM-DD')
        WHERE lastWeek.date IS NOT NULL
        GROUP BY lastWeek.date
        ORDER BY lastWeek.date ASC;
      `,
    );
  }
}
