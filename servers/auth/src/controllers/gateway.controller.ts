import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  MessageDto,
  ForgotPasswordDto,
  TokenDto,
  ResetPasswordDto,
  ErrorDto,
} from '../dtos';
import { ObjectSerializer, CurrentUser } from '../decorators';
import { ResetPasswordService } from '../services/reset-password.service';
import { AuthService } from '../services/auth.service';
import { User } from '../entities';

@Controller('auth')
@ApiTags('auth')
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(MessageDto)
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: MessageDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  forgotPassword(
    @Body() body: ForgotPasswordDto,
    @CurrentUser() currentUser: User,
  ): Promise<MessageDto> {
    return this.resetPasswordService.forgotPassword(body, currentUser);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ObjectSerializer(MessageDto)
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: MessageDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  resetPassword(@Body() body: ResetPasswordDto): Promise<MessageDto> {
    return this.resetPasswordService.resetPassword(body);
  }
}
