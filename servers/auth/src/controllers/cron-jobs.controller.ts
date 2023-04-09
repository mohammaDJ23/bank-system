import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResetPasswordService } from '../services';

@Controller()
export class CronJobsController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Cron(CronExpression.EVERY_5_HOURS)
  removeResetPasswordTokens(): void {
    this.resetPasswordService.removeResetPasswordTokens();
  }
}
