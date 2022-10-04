import { Expose, Transform } from 'class-transformer';

export class BillDto {
  @Expose()
  id: number;

  @Expose()
  amount: string;

  @Expose()
  receiver: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}