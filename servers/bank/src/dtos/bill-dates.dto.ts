import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BillDatesDto {
  @Expose()
  @ApiProperty()
  start: string;

  @Expose()
  @ApiProperty()
  end: string;
}
