import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BillQuantitiesDto {
  @Expose()
  @ApiProperty()
  quantities: number;

  @Expose()
  @ApiProperty()
  amount: string;
}
