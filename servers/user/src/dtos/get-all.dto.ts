import { IsNumber } from 'class-validator';

export class GetAllDto {
  @IsNumber()
  skip: number;

  @IsNumber()
  take: number;
}
