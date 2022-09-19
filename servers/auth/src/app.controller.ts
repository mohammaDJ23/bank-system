import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.appService.signup(body);
  }
}
