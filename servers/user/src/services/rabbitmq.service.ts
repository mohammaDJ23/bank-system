import { Injectable } from '@nestjs/common';
import { Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  applyAcknowledgment(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
