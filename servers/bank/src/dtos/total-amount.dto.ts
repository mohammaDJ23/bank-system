import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TotalAmountDto {
  @Expose()
  @ApiProperty()
  totalAmount: string;
}
