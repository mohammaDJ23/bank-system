import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { hash } from 'bcrypt';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { FindAllDto } from '../dtos/find-all.dto';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { RabbitMqServices } from '../types/rabbitmq';
import { UpdateUserByUserDto } from 'src/dtos/update-user-by-user.dto';
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

  async findOne(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Could not found the user.');

    return user;
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
}
