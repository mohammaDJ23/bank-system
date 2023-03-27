import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BillCountAndTotalAmountDto {
  @Expose()
  @ApiProperty()
  billCounts: string;

  @Expose()
  @ApiProperty()
  billAmounts: string;
}
