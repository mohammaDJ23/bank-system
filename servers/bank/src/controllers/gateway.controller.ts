import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { BillDto } from '../dtos/bill.dto';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ObjectSerializer,
  ListSerializer,
} from '../decorators/serializer.decorator';
import { BillService } from 'src/services/bill.service';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { TotalAmountDto } from 'src/dtos/total-amount.dto';
import { PeriodAmountDto } from 'src/dtos/period-amount.dto';
import { LastWeekDto } from 'src/dtos/last-week.dto';
import { ListDto } from 'src/dtos/list.dto';
import { BillsPeriodDto } from 'src/dtos/bills-period.dto';

@UseGuards(JwtAuthGuard)
@Controller('bank')
export class GatewayController {
  constructor(private readonly billService: BillService) {}

  @Post('bill/create')
  @HttpCode(HttpStatus.CREATED)
  @ObjectSerializer(BillDto)
  createBill(
    @Body() body: CreateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.createBill(body, user);
  }

  @Put('bill/update')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  updateBill(
    @Body() body: UpdateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.updateBill(body, user);
  }

  @Delete('bill/delete')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  deleteBill(
    @Body() body: DeleteBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.deleteBill(body, user);
  }

  @Get('bill/total-amount')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(TotalAmountDto)
  getTotalAmount(@CurrentUser() user: User): Promise<TotalAmountDto> {
    return this.billService.getTotalAmount(user);
  }

  @Post('bill/period-amount')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(TotalAmountDto)
  PeriodAmount(
    @Body() body: PeriodAmountDto,
    @CurrentUser() user: User,
  ): Promise<TotalAmountDto> {
    return this.billService.periodAmount(body, user);
  }

  @Post('bills/period')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  billsPeriod(
    @Body() body: BillsPeriodDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.billsPeriod(body, user);
  }

  @Get('bills/last-week')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(LastWeekDto)
  lastWeekBills(@CurrentUser() user: User): Promise<LastWeekDto[]> {
    return this.billService.lastWeekBills(user);
  }

  @Post('bills/max-amounts')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  maxBillAmounts(
    @Body() body: ListDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.maxBillAmounts(body, user);
  }

  @Post('bills/min-amounts')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  minBillAmounts(
    @Body() body: ListDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.minBillAmounts(body, user);
  }

  @Get('bills/excel')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="bill-reports.xlsx"')
  getBillReports(@CurrentUser() user: User): Promise<StreamableFile> {
    return this.billService.getBillReports(user);
  }

  @Get('bills')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  findAllBills(
    @Body() body: ListDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.findAll(body, user);
  }

  @Get('bill/:id')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  findOneBill(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.findOne(id, user);
  }
}
