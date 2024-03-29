import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { ResetCacheMicroserviceInterceptor } from 'src/interceptors';
import { BillService, RabbitmqService, UserService } from 'src/services';
import { CreatedUserObj, DeletedUserObj, RestoredUserObj, UpdatedUserObj } from 'src/types';
import { DataSource } from 'typeorm';

@Controller('/message-patterns/v1/bank')
export class MessagePatternController {
  constructor(
    private readonly userService: UserService,
    private readonly billService: BillService,
    private readonly dataSource: DataSource,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @EventPattern('created_user')
  createUser(@Payload() payload: CreatedUserObj, @Ctx() context: RmqContext): void {
    this.userService.create(payload, context);
  }

  @EventPattern('updated_user')
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  updateUser(@Payload() payload: UpdatedUserObj, @Ctx() context: RmqContext): void {
    this.userService.update(payload, context);
  }

  @EventPattern('deleted_user')
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  deleteUser(@Payload() payload: DeletedUserObj, @Ctx() context: RmqContext): void {
    this.userService.delete(payload, context);
  }

  @EventPattern('restored_user')
  @UseInterceptors(ResetCacheMicroserviceInterceptor)
  async restore(@Payload() payload: RestoredUserObj, @Ctx() context: RmqContext): Promise<void> {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await this.userService.restoreUser(payload, queryRunner.manager);
        await this.billService.restoreBills(payload, queryRunner.manager);
        await queryRunner.commitTransaction();
        this.rabbitmqService.applyAcknowledgment(context);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
