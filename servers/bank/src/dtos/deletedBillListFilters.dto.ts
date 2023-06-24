import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BillListFiltersDto } from './billListFilters.dto';

export class DeletedBillListFiltersDto extends BillListFiltersDto {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  deletedDate: number;
}
