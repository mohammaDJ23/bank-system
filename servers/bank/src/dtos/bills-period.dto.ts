import { IsDate } from 'class-validator';
import { ListDto } from './list.dto';

export class BillsPeriodDto extends ListDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}
