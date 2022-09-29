import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ServerLifeTimeDto } from './dtos/server-life-time.dto';
import { SaveRequestedDataDto } from './dtos/save-requested-data.dto';

@Controller()
export class MessagePatternsController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('server_life_time')
  livedServer(
    @Payload() payload: ServerLifeTimeDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    return this.appService.serverLifeTime(payload, context);
  }

  @EventPattern('save_requested_data')
  saveRequestedData(
    @Payload() payload: SaveRequestedDataDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    return this.appService.saveRequestedData(payload, context);
  }
}
