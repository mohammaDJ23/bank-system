import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentOauthUser, ObjectSerializer } from 'src/decorators';
import { ErrorDto, OauthTokenDto } from 'src/dtos';
import { GoogleOAuthGuard } from 'src/guards';
import { AuthService } from 'src/services';
import { OauthUser } from 'src/types';

@Controller('/api/v1/auth/google')
@ApiTags('/api/v1/auth/google')
@UseGuards(GoogleOAuthGuard)
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  googleAuth() {}

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.BAD_REQUEST)
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  @ObjectSerializer(OauthTokenDto)
  @ApiResponse({ status: HttpStatus.OK, type: OauthTokenDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  googleAuthRedirect(@CurrentOauthUser() user: OauthUser) {
    return this.authService.loginWithOauth(user);
  }
}
