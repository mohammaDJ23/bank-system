import { Injectable, ConflictException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillDto } from './dtos/create-bill.dto';
import { Bill } from './entities/bill.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Bill) private readonly billService: Repository<Bill>,
    @InjectRepository(User) private readonly userService: Repository<User>,
  ) {}

  createBill(body: CreateBillDto, user: User): Promise<Bill> {
    const createdBill = this.billService.create(body);
    createdBill.user = user;
    return this.billService.save(createdBill);
  }

  findUserById(id: number): Promise<User> {
    return this.userService
      .createQueryBuilder('user')
      .select('*')
      .where('user.id = :id', { id })
      .getRawOne();
  }

  async createUser(payload: User): Promise<void> {
    const user = await this.findUserById(payload.id);

    if (user)
      throw new RpcException(new ConflictException('The user already exist.'));

    payload = this.userService.create(payload);
    await this.userService.save(payload);
  }
}
