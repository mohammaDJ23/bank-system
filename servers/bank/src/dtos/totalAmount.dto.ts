import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TotalAmountDto {
  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Transform(({ obj }) => +obj.start)
  @Expose()
  @ApiProperty()
  start: number;

  @Transform(({ obj }) => +obj.end)
  @Expose()
  @ApiProperty()
  end: number;

  @Expose()
  @ApiProperty()
  quantities: string;
}

export class TotalAmountWithoutDatesDto {
  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Expose()
  @ApiProperty()
  quantities: string;
}
