import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PeriodAmountDto {
  @IsNumber()
  @ApiProperty()
  start: number;

  @IsNumber()
  @ApiProperty()
  end: number;
}
