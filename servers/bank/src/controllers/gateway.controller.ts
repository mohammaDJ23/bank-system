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
} from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { BillDto } from '../dtos/bill.dto';
import { CreateBillDto } from '../dtos/create-bill.dto';
import { Bill } from '../entities/bill.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Serializer } from '../decorators/serializer.decorator';
import { BillService } from 'src/services/bill.service';
import { UpdateBillDto } from 'src/dtos/update-bill.dto';
import { DeleteBillDto } from 'src/dtos/delete-bill.dto';
import { FindAllBillDto } from 'src/dtos/find-all-bill.dto';

@UseGuards(JwtAuthGuard)
@Controller('bank')
export class GatewayController {
  constructor(private readonly billService: BillService) {}

  @Post('bill/create')
  @HttpCode(HttpStatus.CREATED)
  @Serializer(BillDto)
  createBill(
    @Body() body: CreateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.createBill(body, user);
  }

  @Put('bill/update')
  @HttpCode(HttpStatus.OK)
  @Serializer(BillDto)
  updateBill(
    @Body() body: UpdateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.updateBill(body, user);
  }

  @Delete('bill/delete')
  @HttpCode(HttpStatus.OK)
  @Serializer(BillDto)
  deleteBill(
    @Body() body: DeleteBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.deleteBill(body, user);
  }

  @Get('bill/total-amount')
  @HttpCode(HttpStatus.OK)
  getTotalAmount(): Promise<Record<'totalAmount', string>> {
    return this.billService.getTotalAmount();
  }

  @Get('bills')
  @HttpCode(HttpStatus.OK)
  @Serializer(BillDto)
  findAllBills(@Body() body: FindAllBillDto): Promise<[Bill[], number]> {
    return this.billService.findAll(body);
  }

  @Get('bill/:id')
  @HttpCode(HttpStatus.OK)
  @Serializer(BillDto)
  findOneBill(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.findOne(id, user);
  }
}
