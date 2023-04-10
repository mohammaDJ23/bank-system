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
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser, ObjectSerializer, ListSerializer } from '../decorators';
import { BillDto } from '../dtos/bill.dto';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BillService } from 'src/services/bill.service';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import {
  TotalAmountDto,
  TotalAmountWithoutDates,
} from 'src/dtos/total-amount.dto';
import { PeriodAmountDto } from 'src/dtos/period-amount.dto';
import { LastWeekDto } from 'src/dtos/last-week.dto';
import { ListDto } from 'src/dtos/list.dto';
import { ErrorDto } from 'src/dtos/error.dto';
import { UserWithBillInfoDto } from 'src/dtos/user-with-bill-info.dto';
import { UserService } from 'src/services/user.service';

@UseGuards(JwtAuthGuard)
@Controller('bank')
@ApiTags('bank')
export class GatewayController {
  constructor(
    private readonly billService: BillService,
    private readonly userService: UserService,
  ) {}

  @Post('bill/create')
  @HttpCode(HttpStatus.CREATED)
  @ObjectSerializer(BillDto)
  @ApiBody({ type: CreateBillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  createBill(
    @Body() body: CreateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.createBill(body, user);
  }

  @Put('bill/update')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  @ApiBody({ type: UpdateBillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  updateBill(
    @Body() body: UpdateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.updateBill(body, user);
  }

  @Delete('bill/delete')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  @ApiBody({ type: DeleteBillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  deleteBill(
    @Body() body: DeleteBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.deleteBill(body, user);
  }

  @Get('bill/total-amount')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(TotalAmountDto)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: TotalAmountDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getTotalAmount(@CurrentUser() user: User): Promise<TotalAmountDto> {
    return this.billService.getTotalAmount(user);
  }

  @Post('bill/period-amount')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(TotalAmountWithoutDates)
  @ApiBody({ type: PeriodAmountDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: TotalAmountWithoutDates })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  PeriodAmount(
    @Body() body: PeriodAmountDto,
    @CurrentUser() user: User,
  ): Promise<TotalAmountWithoutDates> {
    return this.billService.periodAmount(body, user);
  }

  @Get('bills/last-week')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(LastWeekDto)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: LastWeekDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  lastWeekBills(@CurrentUser() user: User): Promise<LastWeekDto[]> {
    return this.billService.lastWeekBills(user);
  }

  @Post('bills/max-amounts')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  @ApiBody({ type: ListDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  maxBillAmounts(
    @Body() body: ListDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.maxBillAmounts(body, user);
  }

  @Post('bills/min-amounts')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  @ApiBody({ type: ListDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
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
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: StreamableFile })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getBillReports(@CurrentUser() user: User): Promise<StreamableFile> {
    return this.billService.getBillReports(user);
  }

  @Get('bills')
  @HttpCode(HttpStatus.OK)
  @ListSerializer(BillDto)
  @ApiBody({ type: ListDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAllBills(
    @Query('page') page: number,
    @Query('take') take: number,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.findAll(page, take, user);
  }

  @Get('bill/:id')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(BillDto)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findOneBill(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.findOne(id, user);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(UserWithBillInfoDto)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserWithBillInfoDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getUserWithBillInfo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<UserWithBillInfoDto> {
    return this.userService.getUserWithBillInfo(id, user);
  }
}
