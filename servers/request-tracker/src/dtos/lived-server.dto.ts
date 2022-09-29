import { IsString, IsDate } from 'class-validator';

export class LivedServerDto {
  @IsString()
  name: string;

  @IsDate()
  livedTime: Date;
}
