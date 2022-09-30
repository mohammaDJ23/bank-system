import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class CronJobsController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  removeServers(): void {
    this.appService.removeServers();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  removeRequestedData(): void {
    this.appService.removeRequestedData();
  }
}
