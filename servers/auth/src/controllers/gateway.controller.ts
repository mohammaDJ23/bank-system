import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { MessageDto } from '../dtos/message.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { TokenDto } from '../dtos/token.dto';
import { Serializer } from '../decorators/serializer.decorator';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ResetPasswordService } from '../services/reset-password.service';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AdminAuthGuard } from '../guards/admin-auth.guard';

@Controller('auth')
export class GatewayController {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post('login')
  @Serializer(TokenDto)
  login(
    @Body() body: LoginDto,
    @CurrentUser() currentUser: User,
  ): Promise<TokenDto> {
    return this.authService.login(body, currentUser);
  }

  @Post('login/admin')
  @UseGuards(AdminAuthGuard)
  @Serializer(TokenDto)
  adminLogin(
    @Body() body: LoginDto,
    @CurrentUser() currentUser: User,
  ): Promise<TokenDto> {
    return this.authService.login(body, currentUser);
  }

  @Post('forgot-password')
  @Serializer(MessageDto)
  forgotPassword(
    @Body() body: ForgotPasswordDto,
    @CurrentUser() currentUser: User,
  ): Promise<MessageDto> {
    return this.resetPasswordService.forgotPassword(body, currentUser);
  }

  @Post('reset-password')
  @Serializer(MessageDto)
  resetPassword(@Body() body: ResetPasswordDto): Promise<MessageDto> {
    return this.resetPasswordService.resetPassword(body);
  }
}
