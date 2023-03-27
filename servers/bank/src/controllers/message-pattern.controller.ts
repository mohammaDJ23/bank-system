import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from '../entities/user.entity';
import { UserService } from 'src/services/user.service';
import { BillService } from 'src/services/bill.service';
import { BillCountAndTotalAmountDto } from 'src/dtos/bill-count-and-total-amount.dto';

@Controller()
export class MessagePatternController {
  constructor(
    private readonly userService: UserService,
    private readonly billService: BillService,
  ) {}

  @EventPattern('created_user')
  createUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.create(payload, context);
  }

  @EventPattern('updated_user')
  updateUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.update(payload, context);
  }

  @EventPattern('deleted_user')
  deleteUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.delete(payload, context);
  }

  @MessagePattern('get_bill_count_and_total_amount')
  getBillCountAndTotalAmount(
    @Payload() payload: User,
    @Ctx() context: RmqContext,
  ): Promise<BillCountAndTotalAmountDto> {
    return this.billService.getBillCountAndTotalAmount(payload, context);
  }
}
