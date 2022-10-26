import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBillDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
