import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { MESSAGES } from '@nestjs/core/constants';
import { RpcException } from '@nestjs/microservices';
import { Exception } from 'src/types';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const responseBody = this.getResponseBody(httpAdapter, ctx, exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  private getResponseBody(
    httpAdapter: AbstractHttpAdapter,
    ctx: HttpArgumentsHost,
    exception: any,
  ) {
    const { statusCode, message } = this.getExceptionInfo(exception);
    const timestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const responseBody = { statusCode, message, timestamp, path };
    return responseBody;
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

    // HttpException inside the actual routes
    const isHttpException = exception instanceof HttpException;

    // some routes used for messagePattern and gateway are throwing rpc error
    const isRpcException = exception instanceof RpcException;

    // errors from messagePatterns
    const isObjectException =
      exception instanceof Object && Reflect.has(exception, 'response');

    // errors which are an string
    const isStringException = typeof exception === 'string';

    // error response
    let message = MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case isHttpException: {
        const response: Exception = exception.getResponse();
        message = this.getMessage(response);
        statusCode = this.getStatusCode(response);
        break;
      }

      case isRpcException: {
        const response = exception.getError().response;
        message = this.getMessage(response);
        statusCode = this.getStatusCode(response);
        break;
      }

      case isObjectException: {
        const response: Exception = exception.response;
        message = this.getMessage(response);
        statusCode = this.getStatusCode(response);
        break;
      }

      case isStringException: {
        message = exception;
        break;
      }

      default:
        if ('message' in exception) {
          message = exception.message;
        }

        break;
    }

    return { message, statusCode };
  }
}
