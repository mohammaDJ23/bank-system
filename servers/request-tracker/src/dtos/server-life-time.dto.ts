import { IsString, IsDate, IsOptional } from 'class-validator';

export class ServerLifeTimeDto {
  @IsString()
  name: string;

  @IsDate()
  @IsOptional()
  livedTime: Date;

  @IsDate()
  @IsOptional()
  deadTime: Date;
}
