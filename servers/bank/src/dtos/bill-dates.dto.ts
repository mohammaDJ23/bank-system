import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BillDatesDto {
  @Expose()
  @ApiProperty()
  start: number;

  @Expose()
  @ApiProperty()
  end: number;
}
