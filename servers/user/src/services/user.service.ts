import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  DeleteAccountDto,
  UpdateUserByUserDto,
  UserQuantitiesDto,
  LastWeekDto,
  UpdateUserByAdminDto,
} from '../dtos';
import { User } from '../entities';
import { hash } from 'bcrypt';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { RabbitMqServices, Roles, UpdatedUserPartialObj } from '../types';
import { RabbitmqService } from './rabbitmq.service';

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
    if (body.id !== currentUser.id)
      throw new BadRequestException('Could not update a different user.');
    return this.update(body, currentUser);
  }

  async updateByAdmin(
    body: UpdateUserByAdminDto,
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

  async delete(body: DeleteAccountDto): Promise<User> {
    let user = await this.findById(body.id);

    if (!user) throw new NotFoundException('Could not found the user.');

    await this.userRepository.delete(user.id);
    await this.clientProxy.emit('deleted_user', user).toPromise();
    return user;
  }

  async findOne(id: number, user: User): Promise<User> {
    const findedUser = await this.findById(id);

    if (!findedUser || (user.role !== Roles.ADMIN && user.id !== findedUser.id))
      throw new NotFoundException('Could not found the user.');

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
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
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
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();
      this.rabbitmqService.applyAcknowledgment(context);
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  findAll(page: number, take: number): Promise<[User[], number]> {
    return this.userRepository
      .createQueryBuilder()
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();
  }

  async getUserQuantities(): Promise<UserQuantitiesDto> {
    return this.userRepository
      .createQueryBuilder('user')
      .select('COALESCE(COUNT(user.id), 0)::INTEGER', 'quantities')
      .addSelect(
        `COALESCE(SUM((user.role = '${Roles.ADMIN}')::INTEGER), 0)::INTEGER`,
        'adminQuantities',
      )
      .addSelect(
        `COALESCE(SUM((user.role = '${Roles.USER}')::INTEGER), 0)::INTEGER`,
        'userQuantities',
      )
      .getRawOne();
  }

  async lastWeekUsers(): Promise<any> {
    let data: LastWeekDto[] = await this.userRepository.query(
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

    return data.map((item) =>
      Object.assign<LastWeekDto, Partial<LastWeekDto>>(item, {
        date: +item.date,
      }),
    );
  }
}
