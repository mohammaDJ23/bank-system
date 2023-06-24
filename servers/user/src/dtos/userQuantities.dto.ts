import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserQuantitiesDto {
  @Expose()
  @ApiProperty()
  quantities: number;

  @Expose()
  @ApiProperty()
  ownerQuantities: number;

  @Expose()
  @ApiProperty()
  adminQuantities: number;

  @Expose()
  @ApiProperty()
  userQuantities: number;
}
