import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from 'src/guards';

@Controller('/api/v1/auth/google')
export class GoogleController {
  constructor() {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    console.log('google auth');
  }

  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect() {
    console.log('google auth redirect');
  }
}
