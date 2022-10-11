import { IsNumber } from 'class-validator';

export class ListDto {
  @IsNumber()
  take: number;

  @IsNumber()
  page: number;
}
