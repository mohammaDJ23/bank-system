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

  findAll(body: FindAllBillDto): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('user')
      .take(body.take)
      .skip(body.skip)
      .getManyAndCount();
  }

  async getTotalAmount(): Promise<Record<'totalAmount', string>> {
    return this.billRepository
      .createQueryBuilder('bill')
      .select('SUM(bill.amount::INTEGER)', 'totalAmount')
      .getRawOne();
  }
}
