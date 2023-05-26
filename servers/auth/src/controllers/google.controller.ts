import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentOauthUser } from 'src/decorators';
import { GoogleOAuthGuard } from 'src/guards';
import { AuthService } from 'src/services';
import { OauthUser } from 'src/types';

@Controller('/api/v1/auth/google')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {}

  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@CurrentOauthUser() user: OauthUser) {
    return this.authService.loginWithOauth(user);
  }
}
