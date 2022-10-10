import { IsDate, IsNumber } from 'class-validator';

export class BillsPeriodDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  take: number;

  @IsNumber()
  skip: number;
}
