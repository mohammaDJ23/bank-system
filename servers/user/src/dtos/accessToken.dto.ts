import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @Expose()
  @ApiProperty()
  accessToken: string;
}
