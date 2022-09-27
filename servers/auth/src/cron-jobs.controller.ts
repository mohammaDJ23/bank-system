import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('auth')
export class CronJobsController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_5_HOURS)
  removeResetPasswordTokens() {
    this.appService.removeResetPasswordTokens();
  }
}
