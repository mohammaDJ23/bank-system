import { Body, Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';
import { MessageDto } from './dtos/message.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenDto } from './dtos/token.dto';
import { UserDto } from './dtos/user.dto';
import { Serializer } from './interceptors/serialize.interceptor';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class GatewayController {
  constructor(private readonly appService: AppService) {}

  @Get()
  whoAmI(): string {
    return this.appService.whoAmI();
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

  @Post('forgot-password')
  @Serializer(MessageDto)
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<MessageDto> {
    return this.appService.forgotPassword(body);
  }

  @Post('reset-password')
  @Serializer(MessageDto)
  resetPassword(@Body() body: ResetPasswordDto): Promise<MessageDto> {
    return this.appService.resetPassword(body);
  }
}
