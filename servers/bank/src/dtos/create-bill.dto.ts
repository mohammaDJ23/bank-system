import { IsString, IsNumberString, IsDate, Length } from 'class-validator';

export class CreateBillDto {
  @IsNumberString()
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
