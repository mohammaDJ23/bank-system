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
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(payload: User, context: RmqContext): Promise<void> {
    try {
      payload = this.userService.create(payload);
      await this.userService.save(payload);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async update(payload: User, context: RmqContext): Promise<void> {
    try {
      payload = this.userService.create(payload);
      await this.userService.update({ email: payload.email }, payload);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }

  async delete(payload: User, context: RmqContext): Promise<void> {
    try {
      await this.userService.delete(payload.id);
      this.rabbitmqService.applyAcknowledgment(context);
    } catch (error) {
      throw error;
    }
  }
}
