import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TotalAmountDto {
  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Expose()
  @ApiProperty()
  start: number;

  @Expose()
  @ApiProperty()
  end: number;

  @Expose()
  @ApiProperty()
  quantities: string;
}

export class TotalAmountWithoutDates {
  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Expose()
  @ApiProperty()
  quantities: string;
}
