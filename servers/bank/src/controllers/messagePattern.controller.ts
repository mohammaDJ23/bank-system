import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserService } from 'src/services';
import { ResetCachedKeys } from 'src/decorators';
import {
  CacheKeys,
  CreatedUserObj,
  DeletedUserObj,
  UpdatedUserObj,
} from 'src/types';
import { ResetCacheMicroserviceInterceptor } from 'src/interceptors';

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
  @ResetCachedKeys(
    CacheKeys.USER,
    CacheKeys.BILLS,
    CacheKeys.QUANTITIES,
    CacheKeys.TOTAL_AMOUNT,
  )
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  updateUser(
    @Payload() payload: UpdatedUserObj,
    @Ctx() context: RmqContext,
  ): void {
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
  deleteUser(
    @Payload() payload: DeletedUserObj,
    @Ctx() context: RmqContext,
  ): void {
    this.userService.delete(payload, context);
  }
}
