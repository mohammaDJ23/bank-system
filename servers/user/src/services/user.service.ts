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
  UpdateUserDto,
  DeleteAccountDto,
  UpdateUserByUserDto,
  UserQuantitiesDto,
  LastWeekDto,
} from '../dtos';
import { User } from '../entities';
import { hash } from 'bcrypt';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { RabbitMqServices, Roles, UpdateUserPartialObj } from '../types';
import { RabbitmqService } from './rabbitmq.service';
import camelcase from 'camelcase';

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

  updateByUser(
    body: UpdateUserByUserDto,
    currentUser: User,
    context?: RmqContext,
  ): Promise<User> {
    const isSameUser =
      body.id.toString().toLowerCase() ===
      currentUser.id.toString().toLowerCase();

    if (!isSameUser)
      throw new BadRequestException('Could not update a different user.');

    return this.update(body, currentUser, context);
  }

  async findAndUpdate(
    body: Partial<UpdateUserDto>,
    context?: RmqContext,
  ): Promise<User> {
    let user = await this.findById(body.id);

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    return this.update(body, user, context);
  }

  async update(
    body: User | Partial<UpdateUserDto>,
    user: User,
    context?: RmqContext,
  ): Promise<User> {
    try {
      const existedUser = await this.existedUser(body);
      user.updatedAt = new Date();
      user = this.userRepository.create(Object.assign(user, body));
      user = await this.userRepository.save(user);
      await this.clientProxy.emit('updated_user', user).toPromise();

      if (context) {
        this.rabbitmqService.applyAcknowledgment(context);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updatePartial(
    payload: UpdateUserPartialObj,
    context: RmqContext,
  ): Promise<User> {
    try {
      const updateResult = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(payload.user)
        .where('id = :userId')
        .setParameters({ userId: payload.id })
        .returning('*')
        .execute();

      this.rabbitmqService.applyAcknowledgment(context);

      let user = updateResult.raw as User[];

      if (!user.length)
        throw new NotFoundException('Could not found the user.');

      return user.reduce((acc, val) => {
        for (const key in val) acc[camelcase(key)] = val[key];
        return acc;
      }, {} as User);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async existedUser(user: User | Partial<UpdateUserDto>): Promise<User> {
    const existedUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :id', { id: user.id })
      .andWhere('user.email = :email', { email: user.email })
      .getOne();

    if (existedUser)
      throw new RpcException(new ConflictException('Choose another email.'));

    return existedUser;
  }

  async remove(body: DeleteAccountDto): Promise<User> {
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

  async findById(id: number, context?: RmqContext): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      if (context) {
        this.rabbitmqService.applyAcknowledgment(context);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string, context?: RmqContext): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (context) {
        this.rabbitmqService.applyAcknowledgment(context);
      }

      return user;
    } catch (error) {
      throw error;
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
