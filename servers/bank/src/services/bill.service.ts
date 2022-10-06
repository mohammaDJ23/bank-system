import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { FindAllBillDto } from 'src/dtos/find-all-bill.dto';
import { PeriodAmountDto } from 'src/dtos/period-amount.dto';
import { TotalAmountDto } from 'src/dtos/total-amount.dto';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
import { Repository } from 'typeorm';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
  ) {}

  createBill(body: CreateBillDto, user: User): Promise<Bill> {
    const createdBill = this.billRepository.create(body);
    createdBill.user = user;
    return this.billRepository.save(createdBill);
  }

  async updateBill(body: UpdateBillDto, user: User): Promise<Bill> {
    let bill = await this.findById(body.id, user.id);
    bill = Object.assign(bill, body);
    bill = this.billRepository.create(bill);
    return this.billRepository.save(bill);
  }

  async deleteBill(body: DeleteBillDto, user: User): Promise<Bill> {
    const bill = await this.findById(body.id, user.id);
    await this.billRepository.delete(bill.id);
    return bill;
  }

  findOne(id: number, user: User): Promise<Bill> {
    return this.findById(id, user.id);
  }

  async findById(billId: number, userId: number): Promise<Bill> {
    const bill = await this.billRepository
      .createQueryBuilder('bill')
      .where('bill.id = :billId', { billId })
      .andWhere('bill.user.id = :userId', { userId })
      .getOne();

    if (!bill) throw new NotFoundException('Could not found the bill.');

    return bill;
  }

  findAll(body: FindAllBillDto, user: User): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .where('bill.user.id = :userId', { userId: user.id })
      .take(body.take)
      .skip(body.skip)
      .getManyAndCount();
  }

  getTotalAmount(user: User): Promise<TotalAmountDto> {
    return this.billRepository
      .createQueryBuilder('bill')
      .select('SUM(bill.amount::INTEGER)', 'totalAmount')
      .where('bill.user.id = :userId', { userId: user.id })
      .getRawOne();
  }

  periodAmount(body: PeriodAmountDto, user: User): Promise<TotalAmountDto> {
    const { start, end } = body;

    return this.billRepository
      .createQueryBuilder('bill')
      .select('SUM(bill.amount::INTEGER)', 'totalAmount')
      .where('bill.createdAt::TIMESTAMP >= :start::TIMESTAMP', { start })
      .andWhere('bill.createdAt::TIMESTAMP <= :end::TIMESTAMP', { end })
      .andWhere('bill.user.id = :userId', { userId: user.id })
      .getRawOne();
  }
}
