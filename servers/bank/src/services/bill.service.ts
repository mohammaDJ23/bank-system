import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billService: Repository<Bill>,
  ) {}

  createBill(body: CreateBillDto, user: User): Promise<Bill> {
    const createdBill = this.billService.create(body);
    createdBill.user = user;
    return this.billService.save(createdBill);
  }
}
