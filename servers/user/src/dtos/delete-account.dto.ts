import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteAccountDto {
  @IsNumber()
  @ApiProperty()
  id: number;
}
