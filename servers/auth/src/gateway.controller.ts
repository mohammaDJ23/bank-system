import { Body, Controller, Post, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dtos/login.dto';
import { MessageDto } from './dtos/message.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { TokenDto } from './dtos/token.dto';
import { Serializer } from './interceptors/serialize.interceptor';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class GatewayController {
  constructor(private readonly appService: AppService) {}

  @Get()
  whoAmI(): string {
    return this.appService.whoAmI();
  }

  @Post('login')
  @Serializer(TokenDto)
  login(@Body() body: LoginDto): Promise<TokenDto> {
    return this.appService.login(body);
  }

  @Post('login/admin')
  @Serializer(TokenDto)
  adminLogin(@Body() body: LoginDto): Promise<TokenDto> {
    return this.appService.adminLogin(body);
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