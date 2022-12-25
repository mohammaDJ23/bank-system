import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PeriodAmountDto {
  @IsDateString()
  @ApiProperty()
  start: Date;

  @IsDateString()
  @ApiProperty()
  end: Date;
}
