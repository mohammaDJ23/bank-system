import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class CronJobsController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  removeServers() {
    this.appService.removeServers();
  }
}
