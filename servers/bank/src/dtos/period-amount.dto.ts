import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PeriodAmountDto {
  @IsDate()
  @ApiProperty()
  start: Date;

  @IsDate()
  @ApiProperty()
  end: Date;
}
