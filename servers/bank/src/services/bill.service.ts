import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { FindAllBillDto } from 'src/dtos/find-all-bill.dto';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
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

  async updateBill(body: UpdateBillDto, user: User): Promise<Bill> {
    let bill = await this.findById(body.id, user.id);

    if (!bill)
      throw new NotFoundException(
        'Could not found the bill; make sure this is your own bill.',
      );

    bill = Object.assign(bill, body);
    bill = this.billService.create(bill);
    return this.billService.save(bill);
  }

  async deleteBill(body: DeleteBillDto, user: User): Promise<Bill> {
    const bill = await this.findById(body.id, user.id);

    if (!bill) throw new NotFoundException('Could not found the bill.');

    await this.billService.delete(bill.id);
    return bill;
  }

  findById(billId: number, userId: number): Promise<Bill> {
    return this.billService
      .createQueryBuilder('bill')
      .where('bill.id = :billId', { billId })
      .andWhere('bill.user.id = :userId', { userId })
      .getOne();
  }

  findAll(body: FindAllBillDto): Promise<[Bill[], number]> {
    return this.billService
      .createQueryBuilder('user')
      .take(body.take)
      .skip(body.skip)
      .getManyAndCount();
  }
}
