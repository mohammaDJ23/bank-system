import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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

  update(user: User): Promise<User> {
    return this.clientProxy.send<User, User>('update_user', user).toPromise();
  }
}
