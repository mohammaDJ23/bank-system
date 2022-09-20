import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;

    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.message
      : MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;

    const timestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const responseBody = { statusCode, message, timestamp, path };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
