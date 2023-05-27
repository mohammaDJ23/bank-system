import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentOauthUser } from 'src/decorators';
import { ErrorDto } from 'src/dtos';
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
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiResponse({ status: HttpStatus.OK, type: 'text/html' })
  @ApiResponse({ status: HttpStatus.MOVED_PERMANENTLY })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  googleAuthRedirect(
    @Res() response: Response,
    @CurrentOauthUser() user: OauthUser,
  ): Promise<void> {
    return this.authService.loginWithOauth(response, user);
  }
}
