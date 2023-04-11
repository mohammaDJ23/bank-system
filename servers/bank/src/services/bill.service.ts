import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteBillDto,
  LastWeekDto,
  ListDto,
  PeriodAmountDto,
  TotalAmountDto,
  TotalAmountWithoutDates,
  UpdateBillDto,
  CreateBillDto,
} from 'src/dtos';
import { Repository } from 'typeorm';
import { Bill, User } from '../entities';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { join } from 'path';
import { Workbook } from 'exceljs';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
  ) {}

  async createBill(body: CreateBillDto, user: User): Promise<Bill> {
    const createdBill = this.billRepository.create(body);
    createdBill.user = user;
    const insertResult = await this.billRepository
      .createQueryBuilder()
      .insert()
      .into(Bill)
      .values(createdBill)
      .returning('*')
      .execute();
    return insertResult.raw[0];
  }

  async updateBill(body: UpdateBillDto, user: User): Promise<Bill> {
    const updateResult = await this.billRepository
      .createQueryBuilder('bill')
      .update(Bill)
      .set(body)
      .where('bill.user_id = :userId')
      .andWhere('bill.id = :billId')
      .setParameters({ userId: user.userServiceId, billId: body.id })
      .returning('*')
      .execute();
    return updateResult.raw[0];
  }

  async deleteBill(body: DeleteBillDto, user: User): Promise<Bill> {
    const deleteResult = await this.billRepository
      .createQueryBuilder('bill')
      .delete()
      .where('bill.user_id = :userId')
      .andWhere('bill.id = :billId')
      .setParameters({ userId: user.userServiceId, billId: body.id })
      .returning('*')
      .execute();
    return deleteResult.raw[0];
  }

  findOne(id: string, user: User): Promise<Bill> {
    return this.findById(id, user.userServiceId);
  }

  async findById(billId: string, userId: number): Promise<Bill> {
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
      .addSelect('COALESCE(COUNT(bill.id), 0)', 'quantities')
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
      .addSelect('COALESCE(COUNT(bill.id), 0)', 'quantities')
      .where('user.user_service_id = :userId', { userId: user.userServiceId })
      .andWhere('bill.date::TIMESTAMP >= :start::TIMESTAMP', {
        start: new Date(body.start),
      })
      .andWhere('bill.date::TIMESTAMP <= :end::TIMESTAMP', {
        end: new Date(body.end),
      })
      .getRawOne();
  }

  async lastWeekBills(user: User): Promise<LastWeekDto[]> {
    let data: LastWeekDto[] = await this.billRepository.query(
      `
        WITH lastWeek (date) AS (
          VALUES
            (NOW()),
            (NOW() - INTERVAL '1 DAY'),
            (NOW() - INTERVAL '2 DAY'),
            (NOW() - INTERVAL '3 DAY'),
            (NOW() - INTERVAL '4 DAY'),
            (NOW() - INTERVAL '5 DAY'),
            (NOW() - INTERVAL '6 DAY')
        )
        SELECT
          COALESCE(EXTRACT(EPOCH FROM lastWeek.date) * 1000, 0)::BIGINT AS date,
          COALESCE(SUM(bill.amount::BIGINT), 0)::BIGINT AS amount,
          COUNT(bill.id)::INTEGER as count
        FROM lastWeek
        FULL JOIN bill ON to_char(lastWeek.date, 'YYYY-MM-DD') = to_char(bill.date, 'YYYY-MM-DD') AND bill.user_id = $1
        WHERE lastWeek.date IS NOT NULL
        GROUP BY lastWeek.date
        ORDER BY lastWeek.date ASC;
      `,
      [user.userServiceId],
    );

    return data.map((item) =>
      Object.assign<LastWeekDto, Partial<LastWeekDto>>(item, {
        date: +item.date,
      }),
    );
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
