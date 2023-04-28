import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BillService } from 'src/services';

@Controller()
export class CronJobsController {
  constructor(private readonly billService: BillService) {}

  @Cron(CronExpression.EVERY_5_HOURS)
  removeBillReports(): void {
    this.billService.removeBillReports();
  }
}
