import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { Exception } from 'src/types/exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost,
      ctx = host.switchToHttp(),
      { statusCode, message } = this.getExceptionInfo(exception),
      timestamp = new Date().toISOString(),
      path = httpAdapter.getRequestUrl(ctx.getRequest()),
      responseBody = { statusCode, message, timestamp, path };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private getMessage(exception: Exception) {
    return exception instanceof Object ? exception.message : exception;
  }

  private getStatusCode(exception: Exception) {
    return exception instanceof Object
      ? exception.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getExceptionInfo(exception: any) {
    if (process.env.NODE_ENV === 'development')
      console.log(exception, exception.constructor.name);

    let isHttpException = exception instanceof HttpException,
      isRpcException =
        exception instanceof Object && Reflect.has(exception, 'response'),
      isStringException = typeof exception === 'string',
      message = MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case isHttpException: {
        const response: Exception = exception.getResponse();
        message = this.getMessage(response);
        statusCode = this.getStatusCode(response);
        break;
      }

      case isRpcException: {
        const response: Exception = exception.response;
        message = this.getMessage(response);
        statusCode = this.getStatusCode(response);
        break;
      }

      case isStringException: {
        message = exception;
        break;
      }
    }

    return { message, statusCode };
  }
}
