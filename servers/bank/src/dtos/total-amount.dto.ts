import { Expose } from 'class-transformer';

export class TotalAmountDto {
  @Expose()
  totalAmount: string;
}
