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
  PeriodAmountDto,
  TotalAmountDto,
  TotalAmountWithoutDates,
  UpdateBillDto,
  CreateBillDto,
  BillQuantitiesDto,
} from 'src/dtos';
import { Repository } from 'typeorm';
import { Bill, User } from '../entities';
import { createReadStream, existsSync, unlink, rmdir, readdir, rm } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Workbook } from 'exceljs';
import { UserService } from './user.service';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    private readonly userService: UserService,
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

  async deleteBill(id: string, user: User): Promise<Bill> {
    const deleteResult = await this.billRepository
      .createQueryBuilder('bill')
      .delete()
      .where('bill.user_id = :userId')
      .andWhere('bill.id = :billId')
      .setParameters({ userId: user.userServiceId, billId: id })
      .returning('*')
      .execute();
    return deleteResult.raw[0];
  }

  async findById(billId: string, user: User): Promise<Bill> {
    const bill = await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId')
      .andWhere('bill.id = :billId')
      .setParameters({ billId, userId: user.userServiceId })
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
      .leftJoinAndSelect('bill.user', 'user')
      .where('user.user_service_id = :userId')
      .orderBy('bill.date', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .setParameters({ userId: user.userServiceId })
      .getManyAndCount();
  }

  async getTotalAmount(user: User): Promise<TotalAmountDto> {
    return this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.user', 'user')
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
      .where('user.user_service_id = :userId')
      .setParameters({ userId: user.userServiceId })
      .getRawOne();
  }

  async periodAmount(
    body: PeriodAmountDto,
    user: User,
  ): Promise<TotalAmountWithoutDates> {
    return this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.user', 'user')
      .select('COALESCE(SUM(bill.amount::BIGINT), 0)::TEXT', 'totalAmount')
      .addSelect('COALESCE(COUNT(bill.id), 0)', 'quantities')
      .where('user.user_service_id = :userId')
      .andWhere('bill.date::TIMESTAMP >= :start::TIMESTAMP')
      .andWhere('bill.date::TIMESTAMP <= :end::TIMESTAMP')
      .setParameters({
        userId: user.userServiceId,
        start: new Date(body.start),
        end: new Date(body.end),
      })
      .getRawOne();
  }

  async lastWeekBills(user: User): Promise<LastWeekDto[]> {
    return this.billRepository.query(
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
  }

  getBillQuantities(): Promise<BillQuantitiesDto> {
    return this.billRepository
      .createQueryBuilder('bill')
      .select('COUNT(bill.id)::TEXT', 'quantities')
      .addSelect('SUM(bill.amount::BIGINT)::TEXT', 'amount')
      .getRawOne();
  }

  private getBillReportPath(): string {
    return join(process.cwd(), '/reports');
  }

  async getBillReports(id: number): Promise<StreamableFile> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException('Could not found the user.');

    const fileName = `${user.firstName}-${user.lastName}-${user.userServiceId}.xlsx`;
    const path = this.getBillReportPath();
    const filePath = join(path, fileName);

    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }

    const workbook = new Workbook();
    const workSheet = workbook.addWorksheet('bills');
    const billPropertiesMap = this.billRepository.metadata.propertiesMap;
    const propertyNames = Object.values(billPropertiesMap);
    workSheet.columns = propertyNames.map((propertyName) => ({
      header: propertyName,
      key: propertyName,
      width: 20,
    }));

    const bills = await this.billRepository
      .createQueryBuilder('bill')
      .where('bill.user_id = :userId')
      .orderBy('bill.date', 'DESC')
      .setParameters({ userId: user.userServiceId })
      .getMany();
    if (bills.length) {
      workSheet.addRows(bills);
    }

    await workbook.xlsx.writeFile(filePath);

    const readedFile = createReadStream(filePath);
    return new Promise<StreamableFile>((resolve, reject) => {
      readedFile.on('ready', () => {
        resolve(new StreamableFile(readedFile));
        unlink(filePath, (err) => {
          if (err) console.log(err);
        });
      });
      readedFile.on('error', (err: Error) =>
        reject(new InternalServerErrorException(err.message)),
      );
    });
  }

  removeBillReports(): void {
    const path = this.getBillReportPath();
    if (existsSync(path))
      readdir(path, (err, data) => {
        if (err) console.log(err.message);
        else {
          if (data.length <= 0) {
            rmdir(path, (err) => {
              if (err) console.log(err);
            });
          } else {
            rm(path, { recursive: true, force: true }, (err) => {
              if (err) console.log(err);
            });
          }
        }
      });
  }
}
