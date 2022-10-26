import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListDto {
  @IsNumber()
  @ApiProperty()
  take: number;

  @IsNumber()
  @ApiProperty()
  page: number;
}
