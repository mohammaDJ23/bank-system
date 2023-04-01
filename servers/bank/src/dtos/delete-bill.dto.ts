import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBillDto {
  @IsNumberString()
  @ApiProperty()
  id: string;
}
