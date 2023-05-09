import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from '../services';
import { User } from 'src/entities';
import { UpdatedUserPartialObj } from 'src/types';

@Controller('/message-pattenrs/v1/user')
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update_user_partial')
  updatePartial(
    @Payload() payload: UpdatedUserPartialObj,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.userService.updatePartialForMicroservices(payload, context);
  }

  @MessagePattern('find_user_by_id')
  findById(@Payload() id: number, @Ctx() context: RmqContext): Promise<User> {
    return this.userService.findByIdForMicroservices(id, context);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(
    @Payload() email: string,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    return this.userService.findByEmailForMicroservices(email, context);
  }
}
