import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @Expose()
  @ApiProperty()
  accessToken: string;
}

export class OauthTokenDto extends TokenDto {
  @Expose()
  @ApiProperty()
  oauthAccessToken: string;
}
