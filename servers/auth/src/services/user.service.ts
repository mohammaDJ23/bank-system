import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/entities';
import { RabbitMqServices, UpdatedUserPartialObj } from 'src/types';

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

  updatePartial(updatedUser: UpdatedUserPartialObj): Promise<User> {
    return this.clientProxy
      .send<User, UpdatedUserPartialObj>('update_user_partial', updatedUser)
      .toPromise();
  }
}
