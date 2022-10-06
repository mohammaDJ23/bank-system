import { IsNumber } from 'class-validator';

export class DeleteBillDto {
  @IsNumber()
  id: number;
}
