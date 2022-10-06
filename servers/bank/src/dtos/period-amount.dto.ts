import { IsDate } from 'class-validator';

export class PeriodAmountDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}
