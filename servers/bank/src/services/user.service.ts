import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userService: Repository<User>,
  ) {}

  findById(id: number): Promise<User> {
    return this.userService
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async create(payload: User): Promise<void> {
    payload = this.userService.create(payload);
    await this.userService.save(payload);
  }

  async update(payload: User): Promise<void> {
    payload = this.userService.create(payload);
    await this.userService.save(payload);
  }

  async delete(payload: User): Promise<void> {
    await this.userService.delete(payload.id);
  }
}
