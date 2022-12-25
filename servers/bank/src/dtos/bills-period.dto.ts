import { IsDateString } from 'class-validator';
import { ListDto } from './list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BillsPeriodDto extends ListDto {
  @IsDateString()
  @ApiProperty()
  start: Date;

  @IsDateString()
  @ApiProperty()
  end: Date;
}
