import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { LastWeekDto } from 'src/dtos/last-week.dto';
import { ListDto } from 'src/dtos/list.dto';
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

  findAll(body: ListDto, user: User): Promise<[Bill[], number]> {
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

  lastWeekBills(user: User): Promise<LastWeekDto[]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .select('COUNT(bill.date::DATE)::INTEGER', 'count')
      .addSelect('SUM(bill.amount::INTEGER)', 'amount')
      .addSelect('bill.date::DATE', 'date')
      .where('bill.date::DATE >= CURRENT_DATE - 7')
      .andWhere('bill.date::DATE <= CURRENT_DATE - 1')
      .andWhere('bill.user.id = :userId', { userId: user.id })
      .groupBy('bill.date')
      .getRawMany();
  }

  maxBillAmounts(body: ListDto, user: User): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .orderBy('bill.amount', 'DESC')
      .where('bill.user.id = :userId', { userId: user.id })
      .take(body.take)
      .skip(body.skip)
      .getManyAndCount();
  }

  minBillAmounts(body: ListDto, user: User): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .orderBy('bill.amount', 'ASC')
      .where('bill.user.id = :userId', { userId: user.id })
      .take(body.take)
      .skip(body.skip)
      .getManyAndCount();
  }
}
