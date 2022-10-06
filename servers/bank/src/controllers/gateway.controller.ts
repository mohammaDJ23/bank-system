import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
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

@UseGuards(JwtAuthGuard)
@Serializer(BillDto)
@Controller('bank')
export class GatewayController {
  constructor(private readonly billService: BillService) {}

  @Post('create-bill')
  @HttpCode(HttpStatus.CREATED)
  createBill(
    @Body() body: CreateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.createBill(body, user);
  }

  @Put('update-bill')
  @HttpCode(HttpStatus.OK)
  updateBill(
    @Body() body: UpdateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.billService.updateBill(body, user);
  }
}
