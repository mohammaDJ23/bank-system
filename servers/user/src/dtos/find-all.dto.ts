import { IsNumber } from 'class-validator';

export class FindAllDto {
  @IsNumber()
  skip: number;

  @IsNumber()
  take: number;
}
