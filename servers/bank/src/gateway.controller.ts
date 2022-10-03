import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { BillDto } from './dtos/bill.dto';
import { CreateBillDto } from './dtos/create-bill.dto';
import { Bill } from './entities/bill.entity';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-guard';
import { Serializer } from './interceptors/serialize.interceptor';

@Controller('bank')
export class GatewayController {
  constructor(private readonly appService: AppService) {}

  @Post('create-bill')
  @UseGuards(JwtAuthGuard)
  @Serializer(BillDto)
  createBill(
    @Body() body: CreateBillDto,
    @CurrentUser() user: User,
  ): Promise<Bill> {
    return this.appService.createBill(body, user);
  }
}
