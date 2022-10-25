import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListDto {
  @IsNumber()
  @ApiProperty()
  page: number;

  @IsNumber()
  @ApiProperty()
  take: number;
}
