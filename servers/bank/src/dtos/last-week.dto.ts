import { Expose } from 'class-transformer';

export class LastWeekDto {
  @Expose()
  count: number;

  @Expose()
  amount: string;

  @Expose()
  date: Date;
}
