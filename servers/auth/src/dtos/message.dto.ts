import { Expose } from 'class-transformer';

export class MessageDto {
  @Expose()
  message: string;
}
