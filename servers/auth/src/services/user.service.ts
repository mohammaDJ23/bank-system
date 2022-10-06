import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { RabbitMqServices } from 'src/types/rabbitmq';

@Injectable()
export class UserService {
  constructor(
    @Inject(RabbitMqServices.AUTH) private readonly clientProxy: ClientProxy,
  ) {}

  findById(id: number): Promise<User> {
    return this.clientProxy
      .send<User, number>('find_user_by_id', id)
      .toPromise();
  }

  findByEmail(email: string): Promise<User> {
    return this.clientProxy
      .send<User, string>('find_user_by_email', email)
      .toPromise();
  }

  findAndUpdate(user: User): Promise<User> {
    return this.clientProxy
      .send<User, User>('find_and_update_user', user)
      .toPromise();
  }

  update(
    updatedUser: User | Partial<UpdateUserDto>,
    user: User,
  ): Promise<User> {
    return this.clientProxy
      .send<User, Record<string, User | Partial<UpdateUserDto>>>(
        'update_user',
        { updatedUser, user },
      )
      .toPromise();
  }
}
