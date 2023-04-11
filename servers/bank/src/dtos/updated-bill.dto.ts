import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatedBillDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  amount: string;

  @Expose()
  @ApiProperty()
  receiver: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  date: Date;

  @Expose({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;

  @Expose({ name: 'user_id' })
  @ApiProperty()
  userId: number;
}
