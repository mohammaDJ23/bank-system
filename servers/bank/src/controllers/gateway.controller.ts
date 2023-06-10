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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CacheKey,
  CurrentUser,
  ResetCachedKeys,
  Roles,
  SameUser,
} from 'src/decorators';
import {
  BillDto,
  CreateBillDto,
  UpdateBillDto,
  TotalAmountDto,
  TotalAmountWithoutDatesDto,
  PeriodAmountDto,
  LastWeekDto,
  ErrorDto,
  UserWithBillInfoDto,
  CreatedBillDto,
  UpdatedBillDto,
  DeletedBillDto,
  BillQuantitiesDto,
  BillListFiltersDto,
  DeletedBillListFiltersDto,
} from 'src/dtos';
import { Bill, User } from 'src/entities';
import {
  DifferentOwnerGuard,
  JwtGuard,
  RolesGuard,
  SameUserGuard,
} from 'src/guards';
import { BillService, UserService } from 'src/services';
import { CacheKeys, UserRoles } from 'src/types';
import { ParseBillListFiltersPipe } from 'src/pipes';
import {
  BillListSerializeInterceptor,
  BillObjectSerializeInterceptor,
  BillQuantitiesObjectSerializeInterceptor,
  CacheInterceptor,
  CreatedBillObjectSerializeInterceptor,
  DeletedBillObjectSerializeInterceptor,
  LastWeekArraySerializeInterceptor,
  ResetCacheInterceptor,
  TotalAmountObjectSerializeInterceptor,
  TotalAmountWithoutDatesObjectSerializeInterceptor,
  UpdatedBillObjectSerializeInterceptor,
  UserWithBillInfoObjectSerializeInterceptor,
} from 'src/interceptors';

@UseGuards(JwtGuard)
@Controller('/api/v1/bank')
@ApiTags('/api/v1/bank')
export class GatewayController {
  constructor(
    private readonly billService: BillService,
    private readonly userService: UserService,
  ) {}

  @Post('bill/create')
  @HttpCode(HttpStatus.CREATED)
  @ResetCachedKeys(
    CacheKeys.TOTAL_AMOUNT,
    CacheKeys.QUANTITIES,
    CacheKeys.BILLS,
    CacheKeys.USER,
  )
  @UseInterceptors(ResetCacheInterceptor, CreatedBillObjectSerializeInterceptor)
  @ApiBody({ type: CreateBillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatedBillDto })
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
  @ResetCachedKeys(
    CacheKeys.TOTAL_AMOUNT,
    CacheKeys.QUANTITIES,
    CacheKeys.BILLS,
    CacheKeys.BILL,
    CacheKeys.USER,
  )
  @UseInterceptors(ResetCacheInterceptor, UpdatedBillObjectSerializeInterceptor)
  @ApiBody({ type: UpdateBillDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UpdatedBillDto })
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
  @ResetCachedKeys(
    CacheKeys.TOTAL_AMOUNT,
    CacheKeys.QUANTITIES,
    CacheKeys.BILLS,
    CacheKeys.BILL,
    CacheKeys.USER,
    CacheKeys.DELETED_BILLS,
  )
  @UseInterceptors(ResetCacheInterceptor, DeletedBillObjectSerializeInterceptor)
  @ApiQuery({ name: 'id', type: 'string' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: DeletedBillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  deleteBill(
    @Query('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.deleteBill(id, user);
  }

  @Get('bill/total-amount')
  @HttpCode(HttpStatus.OK)
  @CacheKey(CacheKeys.TOTAL_AMOUNT, { isUnique: true })
  @UseInterceptors(CacheInterceptor, TotalAmountObjectSerializeInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: TotalAmountDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getTotalAmount(@CurrentUser() user: User): Promise<TotalAmountDto> {
    return this.billService.getTotalAmount(user);
  }

  @Get('bill/quantities')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRoles.OWNER, UserRoles.ADMIN)
  @CacheKey(CacheKeys.QUANTITIES)
  @UseGuards(RolesGuard)
  @UseInterceptors(CacheInterceptor, BillQuantitiesObjectSerializeInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillQuantitiesDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getBillQuantities(): Promise<BillQuantitiesDto> {
    return this.billService.getBillQuantities();
  }

  @Post('bill/period-amount')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TotalAmountWithoutDatesObjectSerializeInterceptor)
  @ApiBody({ type: PeriodAmountDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: TotalAmountWithoutDatesDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  PeriodAmount(
    @Body() body: PeriodAmountDto,
    @CurrentUser() user: User,
  ): Promise<TotalAmountWithoutDatesDto> {
    return this.billService.periodAmount(body, user);
  }

  @Get('bill/last-week')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LastWeekArraySerializeInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: LastWeekDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  lastWeekBills(@CurrentUser() user: User): Promise<LastWeekDto[]> {
    return this.billService.lastWeekBills(user);
  }

  @Get('bill/excel')
  @HttpCode(HttpStatus.OK)
  @SameUser(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(SameUserGuard, DifferentOwnerGuard)
  @ApiQuery({ name: 'id', type: 'number' })
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="bill-reports.xlsx"')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: StreamableFile })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getBillReports(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    return this.billService.getBillReports(id);
  }

  @Get('bill/all')
  @HttpCode(HttpStatus.OK)
  @CacheKey(CacheKeys.BILLS, { isUnique: true })
  @UseInterceptors(CacheInterceptor, BillListSerializeInterceptor)
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'take', type: 'number' })
  @ApiQuery({ name: 'filters', type: BillListFiltersDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('filters', ParseBillListFiltersPipe) filters: BillListFiltersDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.findAll(page, take, filters, user);
  }

  @Get('bill/all/deleted')
  @HttpCode(HttpStatus.OK)
  @CacheKey(CacheKeys.DELETED_BILLS, { isUnique: true })
  @UseInterceptors(CacheInterceptor, BillListSerializeInterceptor)
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'take', type: 'number' })
  @ApiQuery({ name: 'filters', type: DeletedBillListFiltersDto })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto, isArray: true })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findAllDeleted(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
    @Query('filters', ParseBillListFiltersPipe)
    filters: DeletedBillListFiltersDto,
    @CurrentUser() user: User,
  ): Promise<[Bill[], number]> {
    return this.billService.findAllDeleted(page, take, filters, user);
  }

  @Get('bill/:id')
  @HttpCode(HttpStatus.OK)
  @CacheKey(CacheKeys.BILL, { isUnique: true })
  @UseInterceptors(CacheInterceptor, BillObjectSerializeInterceptor)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findById(@Param('id') id: string, @CurrentUser() user: User): Promise<Bill> {
    return this.billService.findById(id, user);
  }

  @Get('bill/:id/deleted')
  @HttpCode(HttpStatus.OK)
  @CacheKey(CacheKeys.DELETED_BILL, { isUnique: true })
  @UseInterceptors(CacheInterceptor, BillObjectSerializeInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  findDeletedOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.findDeletedOne(id, user);
  }

  @Post('bill/:id/restore')
  @HttpCode(HttpStatus.OK)
  @ResetCachedKeys(
    CacheKeys.TOTAL_AMOUNT,
    CacheKeys.QUANTITIES,
    CacheKeys.BILLS,
    CacheKeys.USER,
    CacheKeys.DELETED_BILL,
    CacheKeys.DELETED_BILLS,
  )
  @UseInterceptors(ResetCacheInterceptor, BillObjectSerializeInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: BillDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  restoreOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.restoreOne(id, user);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @SameUser(UserRoles.USER)
  @CacheKey(CacheKeys.USER, { isUnique: true })
  @UseGuards(SameUserGuard)
  @UseInterceptors(CacheInterceptor, UserWithBillInfoObjectSerializeInterceptor)
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UserWithBillInfoDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  getUserWithBillInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserWithBillInfoDto> {
    return this.userService.getUserWithBillInfo(id);
  }
}
