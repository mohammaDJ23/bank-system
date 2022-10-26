import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { MessageDto } from '../dtos/message.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { TokenDto } from '../dtos/token.dto';
import {
  ListSerializer,
  ObjectSerializer,
} from '../decorators/serializer.decorator';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ResetPasswordService } from '../services/reset-password.service';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { ErrorDto } from 'src/dtos/error.dto';

@Controller('auth')
export class GatewayController {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(TokenDto)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: TokenDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  login(
    @Body() body: LoginDto,
    @CurrentUser() currentUser: User,
  ): Promise<TokenDto> {
    return this.authService.login(body, currentUser);
  }

  @Post('login/admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  @ObjectSerializer(TokenDto)
  adminLogin(
    @Body() body: LoginDto,
    @CurrentUser() currentUser: User,
  ): Promise<TokenDto> {
    return this.authService.login(body, currentUser);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(MessageDto)
  forgotPassword(
    @Body() body: ForgotPasswordDto,
    @CurrentUser() currentUser: User,
  ): Promise<MessageDto> {
    return this.resetPasswordService.forgotPassword(body, currentUser);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(MessageDto)
  resetPassword(@Body() body: ResetPasswordDto): Promise<MessageDto> {
    return this.resetPasswordService.resetPassword(body);
  }
}
