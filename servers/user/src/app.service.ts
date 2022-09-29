import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserDto } from './dtos/user-dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindAllDto } from './dtos/find-all.dto';
import { DeleteAccountDto } from './dtos/delete-account.dto';
import { RabbitMqServices } from './types/rabbitmq';

@Injectable()
export class AppService implements OnApplicationShutdown {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(RabbitMqServices.USER) private readonly clientProxy: ClientProxy,
  ) {}

  whoAmI(): string {
    return 'hello!';
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    const data = { name: 'user', date: new Date() };
    await this.clientProxy.emit('downed_server', data).toPromise();
  }

  async create(payload: CreateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOneBy({ email: payload.email });

    if (user)
      throw new RpcException(new ConflictException('The user already exist.'));

    payload.password = await hash(payload.password, 10);
    user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  }

  async update(payload: Partial<UpdateUserDto>): Promise<UserDto> {
    let user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    user = this.userRepository.create(Object.assign(user, payload));
    return this.userRepository.save(user);
  }

  async remove(body: DeleteAccountDto) {
    const user = await this.userRepository.findOneBy({ id: body.id });
    if (!user) throw new NotFoundException('Could not found the user.');
    return this.userRepository.remove(user);
  }

  async findById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    return user;
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      throw new RpcException(
        new NotFoundException('Could not found the user.'),
      );

    return user;
  }

  async findAll(payload: FindAllDto): Promise<[UserDto[], number]> {
    return this.userRepository.findAndCount({
      take: payload.take,
      skip: payload.skip,
    });
  }
}
