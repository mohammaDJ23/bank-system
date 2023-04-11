import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from '../services';
import { User } from 'src/entities';
import { UpdateUserPartialObj } from 'src/types';

@Controller()
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update_user_partial')
  updatePartial(
    @Payload() payload: UpdateUserPartialObj,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.userService.updatePartial(payload, context);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number, @Ctx() context: RmqContext): Promise<User> {
    return this.userService.findById(id, context);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(
    @Payload() email: string,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.userService.findByEmail(email, context);
  }
}
