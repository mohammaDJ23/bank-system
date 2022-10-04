import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/entities/user.entity';
import { RabbitMqServices } from 'src/types/rabbitmq';

@Injectable()
export class UserService {
  constructor(
    @Inject(RabbitMqServices.AUTH) private readonly clientProxy: ClientProxy,
  ) {}

  // get a user by an id

  findById(id: number): Promise<User> {
    return this.clientProxy
      .send<User, number>('find_user_by_id', id)
      .toPromise();
  }

  // get a user by an email

  findByEmail(email: string): Promise<User> {
    return this.clientProxy
      .send<User, string>('find_user_by_email', email)
      .toPromise();
  }

  // udpating the user

  update(user: User): Promise<User> {
    return this.clientProxy.send<User, User>('update_user', user).toPromise();
  }
}
