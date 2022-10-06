import {
  IsString,
  IsNumber,
  IsNumberString,
  Length,
  IsDate,
} from 'class-validator';

export class UpdateBillDto {
  @IsNumber()
  id: number;

  @IsNumberString()
  @Length(1, 100)
  amount: string;

  @IsString()
  @Length(3, 100)
  receiver: string;

  @IsString()
  @Length(3, 500)
  description: string;

  @IsDate()
  date: Date;
}
