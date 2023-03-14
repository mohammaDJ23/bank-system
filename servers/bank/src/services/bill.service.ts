import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { LastWeekDto } from 'src/dtos/last-week.dto';
import { ListDto } from 'src/dtos/list.dto';
import { PeriodAmountDto } from 'src/dtos/period-amount.dto';
import {
  TotalAmountDto,
  TotalAmountWithoutDates,
} from 'src/dtos/total-amount.dto';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
import { Repository } from 'typeorm';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { join } from 'path';
import { Workbook } from 'exceljs';

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
    let bill = await this.findById(body.id, user.userServiceId);
    bill = Object.assign(bill, body);
    bill = this.billRepository.create(bill);
    return this.billRepository.save(bill);
  }

  async deleteBill(body: DeleteBillDto, user: User): Promise<Bill> {
    const bill = await this.findById(body.id, user.userServiceId);
    await this.billRepository.delete({ id: bill.id });
    return bill;
  }

  findOne(id: number, user: User): Promise<Bill> {
    return this.findById(id, user.userServiceId);
  }

  async findById(billId: number, userId: number): Promise<Bill> {
    const bill = await this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId', { userId })
      .andWhere('bill.id = :billId', { billId })
      .getOne();

    if (!bill) throw new NotFoundException('Could not found the bill.');

    return bill;
  }

  async findAll(
    page: number,
    take: number,
    user: User,
  ): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId', { userId: user.userServiceId })
      .orderBy('bill.date', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getManyAndCount();
  }

  findAllWithoutLimitation(user: User): Promise<Bill[]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId', {
        userId: user.userServiceId,
      })
      .orderBy('bill.date::TIMESTAMP', 'DESC')
      .getMany();
  }

  async getTotalAmount(user: User): Promise<TotalAmountDto> {
    const data: TotalAmountDto = await this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .select('COALESCE(SUM(bill.amount::BIGINT), 0)::TEXT', 'totalAmount')
      .addSelect(
        'COALESCE(EXTRACT(EPOCH FROM MIN(bill.date)) * 1000, 0)::BIGINT',
        'start',
      )
      .addSelect(
        'COALESCE(EXTRACT(EPOCH FROM MAX(bill.date)) * 1000, 0)::BIGINT',
        'end',
      )
      .where('user.user_service_id = :userId', {
        userId: user.userServiceId,
      })
      .getRawOne();

    return Object.assign<TotalAmountDto, Partial<TotalAmountDto>>(data, {
      start: +data.start,
      end: +data.end,
    });
  }

  async periodAmount(
    body: PeriodAmountDto,
    user: User,
  ): Promise<TotalAmountWithoutDates> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .select('COALESCE(SUM(bill.amount::BIGINT), 0)::TEXT', 'totalAmount')
      .where('user.user_service_id = :userId', { userId: user.userServiceId })
      .andWhere('bill.date::TIMESTAMP >= :start::TIMESTAMP', {
        start: new Date(body.start),
      })
      .andWhere('bill.date::TIMESTAMP <= :end::TIMESTAMP', {
        end: new Date(body.end),
      })
      .getRawOne();
  }

  lastWeekBills(user: User): Promise<LastWeekDto[]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .select('COUNT(bill.date::TIMESTAMP)::INTEGER', 'count')
      .addSelect('SUM(bill.amount::NUMERIC)::TEXT', 'amount')
      .addSelect('bill.date::TIMESTAMP', 'date')
      .where('bill.date::TIMESTAMP >= CURRENT_DATE - 6')
      .andWhere('bill.date::TIMESTAMP <= CURRENT_DATE ')
      .andWhere('user.user_service_id = :userId', {
        userId: user.userServiceId,
      })
      .groupBy('bill.date')
      .getRawMany();
  }

  maxBillAmounts(body: ListDto, user: User): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId', { userId: user.userServiceId })
      .orderBy('bill.amount', 'DESC')
      .take(body.take)
      .skip((body.page - 1) * body.take)
      .getManyAndCount();
  }

  minBillAmounts(body: ListDto, user: User): Promise<[Bill[], number]> {
    return this.billRepository
      .createQueryBuilder('bill')
      .innerJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId', { userId: user.userServiceId })
      .orderBy('bill.amount', 'ASC')
      .take(body.take)
      .skip((body.page - 1) * body.take)
      .getManyAndCount();
  }

  async makeBillReports(fileName: string, user: User): Promise<void> {
    const bills = await this.findAllWithoutLimitation(user);
    const workbook = new Workbook();
    const workSheet = workbook.addWorksheet('bills');

    if (bills.length) {
      workSheet.columns = Object.keys(bills[0]).map((item) => {
        return { header: item, key: item, width: 20 };
      });

      workSheet.addRows(bills);
    }

    await workbook.xlsx.writeFile(fileName);
  }

  createReadStream(fileName: string): ReadStream {
    return createReadStream(join(process.cwd(), fileName));
  }

  async getSteamableFile(fileName: string): Promise<StreamableFile> {
    const readedFile = this.createReadStream(fileName);

    readedFile.on('error', (err: Error) => {
      throw new InternalServerErrorException(err.message);
    });

    return new Promise<StreamableFile>((resolve) =>
      readedFile.on('ready', () => {
        resolve(new StreamableFile(readedFile));
      }),
    );
  }

  async getBillReports(user: User): Promise<StreamableFile> {
    const billReportsFileName = 'bill-reports.xlsx';

    if (!existsSync(billReportsFileName))
      await this.makeBillReports(billReportsFileName, user);

    return this.getSteamableFile(billReportsFileName);
  }
}
