import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DowndServerDto } from './dtos/downed-server.dto';

@Controller()
export class MessagePatternsController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('downed_server')
  downedServer(
    @Payload() payload: DowndServerDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    return this.appService.downdServer(payload, context);
  }
}
