import { IsString, IsNumber, IsNumberString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBillDto {
  @IsNumberString()
  @ApiProperty()
  id: string;

  @IsNumberString()
  @Length(1, 18)
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
