import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillDto } from './dtos/create-bill.dto';
import { Bill } from './entities/bill.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Bill) private readonly billService: Repository<Bill>,
  ) {}

  async createBill(
    body: CreateBillDto /**, currentUser: user */,
  ): Promise<Bill> {
    const createdBill = this.billService.create(body);
    // createdBill.user = user
    return this.billService.save(createdBill);
  }
}
