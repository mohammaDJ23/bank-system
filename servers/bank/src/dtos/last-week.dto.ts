import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LastWeekDto {
  @Expose()
  @ApiProperty()
  count: number;

  @Expose()
  @ApiProperty()
  amount: string;

  @Transform(({ obj }) => +obj.date)
  @Expose()
  @ApiProperty()
  date: number;
}
