import { IsNumber } from 'class-validator';

export class DeleteAccountDto {
  @IsNumber()
  id: number;
}
