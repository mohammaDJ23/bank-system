import {
  IsString,
  IsNumber,
  IsNumberString,
  Length,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBillDto {
  @IsNumber()
  @ApiProperty()
  id: number;

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

  @IsDate()
  @ApiProperty()
  date: Date;
}
