import { IsNumber } from 'class-validator';
import { ListDto } from './list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BillsPeriodDto extends ListDto {
  @IsNumber()
  @ApiProperty()
  start: number;

  @IsNumber()
  @ApiProperty()
  end: number;
}
