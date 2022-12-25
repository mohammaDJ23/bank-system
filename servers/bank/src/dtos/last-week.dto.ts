import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LastWeekDto {
  @Expose()
  @ApiProperty()
  count: number;

  @Expose()
  @ApiProperty()
  amount: string;

  @Expose()
  @ApiProperty()
  date: string;
}
