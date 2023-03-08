import { IsString, IsNumberString, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @IsNumberString()
  @Length(1, 100)
  @ApiProperty()
  amount: string;

  @IsString()
  @Length(3, 100)
  @ApiProperty()
  receiver: string;

  @IsString()
  @Length(3, 500)
  @ApiProperty()
  description: string;

  @IsNumber()
  @ApiProperty()
  date: number;
}
