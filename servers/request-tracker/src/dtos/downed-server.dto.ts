import { IsString, IsDate } from 'class-validator';

export class DowndServerDto {
  @IsString()
  name: string;

  @IsDate()
  deadTime: Date;
}
