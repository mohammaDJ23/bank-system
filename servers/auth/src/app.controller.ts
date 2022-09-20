import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupDto } from './dtos/signup.dto';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  signup(@Body() body: SignupDto): Promise<UserDto | void> {
    return this.appService.signup(body);
  }
}
