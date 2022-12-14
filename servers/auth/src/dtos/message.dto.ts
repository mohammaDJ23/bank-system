import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @Expose()
  @ApiProperty()
  message: string;
}
