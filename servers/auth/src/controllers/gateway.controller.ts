import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  MessageDto,
  ForgotPasswordDto,
  TokenDto,
  ResetPasswordDto,
  ErrorDto,
} from 'src/dtos';
import { CurrentUser } from 'src/decorators';
import { ResetPasswordService, AuthService } from 'src/services';
import { User } from 'src/entities';
import {
  MessageSerializerInterceptor,
  TokenSerializerInterceptor,
} from 'src/interceptors';

@Controller('/api/v1/auth')
@ApiTags('/api/v1/auth')
export class GatewayController {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenSerializerInterceptor)
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
  @UseInterceptors(MessageSerializerInterceptor)
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
  @UseInterceptors(MessageSerializerInterceptor)
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, type: MessageDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ErrorDto })
  resetPassword(@Body() body: ResetPasswordDto): Promise<MessageDto> {
    return this.resetPasswordService.resetPassword(body);
  }
}
