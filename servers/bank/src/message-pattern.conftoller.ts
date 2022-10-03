import { Controller, Post, Body } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { User } from './entities/user.entity';

@Controller('bank')
export class MessagePatternController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('created_user')
  createUser(@Payload() payload: User): Promise<void> {
    return this.appService.createUser(payload);
  }
}
