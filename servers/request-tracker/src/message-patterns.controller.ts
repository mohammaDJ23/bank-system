import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DowndServerDto } from './dtos/downed-server.dto';

@Controller()
export class MessagePatternsController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('downed_server')
  downedServer(@Payload() payload: DowndServerDto): Promise<void> {
    return this.appService.downdServer(payload);
  }
}
