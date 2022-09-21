import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { Serializer } from './interceptors/serialize.interceptor';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  @Serializer(UserDto)
  signup(@Body() body: SignupDto): Promise<UserDto> {
    return this.appService.signup(body);
  }

  @Post('login')
  @Serializer(TokenDto)
  login(@Body() body: LoginDto): Promise<TokenDto> {
    return this.appService.login(body);
  }
}
