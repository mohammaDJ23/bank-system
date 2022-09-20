import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupDto } from './dtos/signup.dto';
import { UserDto } from './dtos/user.dto';
import { Serializer } from './interceptors/serialize.interceptor';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  @Serializer(UserDto)
  signup(@Body() body: SignupDto): Promise<UserDto | void> {
    return this.appService.signup(body);
  }
}
