import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { User } from '../entities';
import { UserService } from 'src/services';
import { ResetCachedKeys } from 'src/decorators';
import { CacheKeys } from 'src/types';
import { ResetCacheMicroserviceInterceptor } from 'src/interceptors';

@Controller('/message-patterns/v1/bank')
export class MessagePatternController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('created_user')
  createUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.create(payload, context);
  }

  @EventPattern('updated_user')
  @ResetCachedKeys(
    CacheKeys.USER,
    CacheKeys.BILLS,
    CacheKeys.QUANTITIES,
    CacheKeys.TOTAL_AMOUNT,
  )
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  updateUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.update(payload, context);
  }

  @EventPattern('deleted_user')
  @ResetCachedKeys(
    CacheKeys.USER,
    CacheKeys.BILLS,
    CacheKeys.BILL,
    CacheKeys.QUANTITIES,
    CacheKeys.TOTAL_AMOUNT,
  )
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  deleteUser(@Payload() payload: User, @Ctx() context: RmqContext): void {
    this.userService.delete(payload, context);
  }
}
