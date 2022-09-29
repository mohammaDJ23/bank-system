import { IsDate, IsObject, IsString } from 'class-validator';

export class SaveRequestedDataDto {
  @IsString()
  serverName: string;

  @IsString()
  message: string;

  @IsDate()
  date: Date;

  @IsObject()
  data: Object;
}
