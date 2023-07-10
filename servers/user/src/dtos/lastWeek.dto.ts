import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LastWeekDto {
  @Expose()
  @ApiProperty()
  count: number;

  @Transform(({ obj }) => +obj.date)
  @Expose()
  @ApiProperty()
  date: number;
}
