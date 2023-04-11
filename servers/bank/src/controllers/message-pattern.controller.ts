import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { User } from '../entities';
import { UserService } from 'src/services';

@Controller()
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

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
}
