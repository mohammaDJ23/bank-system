import { IsDate } from 'class-validator';
import { ListDto } from './list.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BillsPeriodDto extends ListDto {
  @IsDate()
  @ApiProperty()
  start: Date;

  @IsDate()
  @ApiProperty()
  end: Date;
}
