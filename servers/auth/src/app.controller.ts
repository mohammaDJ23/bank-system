import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './decorators/user.decorator';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-guard';
import { Serializer } from './interceptors/serialize.interceptor';
import { User } from './types/user';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(@CurrentUser() currentUser: User): string {
    return this.appService.getHello(currentUser);
  }

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
