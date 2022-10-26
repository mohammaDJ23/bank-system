import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @Expose()
  @ApiProperty()
  accessToken: string;
}
