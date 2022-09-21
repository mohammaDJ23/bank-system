import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { LocalAuthGuard } from './guards/local.guard';
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
  @UseGuards(LocalAuthGuard)
  @Serializer(TokenDto)
  login(@User() user: LoginDto): TokenDto {
    return this.appService.login(user);
  }
}
