import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BillService } from 'src/services';

@Controller('/cron-jobs/v1/bank')
export class CronJobsController {
  constructor(private readonly billService: BillService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  removeBillReports(): void {
    this.billService.removeBillReports();
  }
}
