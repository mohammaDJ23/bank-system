import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RabbitmqService } from './rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  findById(id: number): Promise<User> {
    return this.userService
      .createQueryBuilder('user')
      .where('user.user_service_id = :id', { id })
      .getOne();
  }

  async create(payload: User, context: RmqContext): Promise<void> {
    try {
      let user = Object.assign<User, Partial<User>>(payload, {
        userServiceId: payload.id,
      });
      user = this.userService.create(user);
      await this.userService.save(user);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async update(payload: User, context: RmqContext): Promise<void> {
    try {
      let user = await this.findById(payload.id);
      user.email = payload.email;
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.password = payload.password;
      user.phone = payload.phone;
      user.role = payload.role;
      user.userServiceId = payload.id;
      user.updatedAt = payload.updatedAt;
      user.createdAt = payload.createdAt;
      user = this.userService.create(user);
      await this.userService.update(
        { userServiceId: user.userServiceId },
        user,
      );
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async delete(payload: User, context: RmqContext): Promise<void> {
    try {
      await this.userService.delete({ userServiceId: payload.id });
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }
}
