import { IsNumber } from 'class-validator';

export class ListDto {
  @IsNumber()
  page: number;

  @IsNumber()
  take: number;
}
