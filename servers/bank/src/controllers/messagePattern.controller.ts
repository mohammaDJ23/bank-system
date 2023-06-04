import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserService } from 'src/services';
import { CreatedUserObj, DeletedUserObj, UpdatedUserObj } from 'src/types';

@Controller('/message-patterns/v1/bank')
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('created_user')
  createUser(
    @Payload() payload: CreatedUserObj,
    @Ctx() context: RmqContext,
  ): void {
    this.userService.create(payload, context);
  }

  @EventPattern('updated_user')
  updateUser(
    @Payload() payload: UpdatedUserObj,
    @Ctx() context: RmqContext,
  ): void {
    this.userService.update(payload, context);
  }

  @EventPattern('deleted_user')
  deleteUser(
    @Payload() payload: DeletedUserObj,
    @Ctx() context: RmqContext,
  ): void {
    this.userService.delete(payload, context);
  }
}
