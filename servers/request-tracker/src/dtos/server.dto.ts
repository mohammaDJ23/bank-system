import { Expose } from 'class-transformer';

export class ServerDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  deadTime: Date;

  @Expose()
  livedTime: Date;
}
