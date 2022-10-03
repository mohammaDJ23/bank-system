import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBillDto } from './dtos/create-bill.dto';
import { Bill } from './entities/bill.entity';

@Controller('bank')
export class GatewayController {
  constructor(private readonly appService: AppService) {}

  @Post('create-bill')
  createBill(@Body() body: CreateBillDto): Promise<Bill> {
    return this.appService.createBill(body);
  }
}
