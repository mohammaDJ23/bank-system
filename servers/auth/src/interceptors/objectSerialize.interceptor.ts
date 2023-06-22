import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { MessageDto, TokenDto } from 'src/dtos';
import { ClassConstructor } from 'src/types';

export class ObjectSerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<object> {
    return handler.handle().pipe(
      map((data: object) => {
        return this.plainToClass(data);
      }),
    );
  }

  plainToClass(data: object) {
    return plainToClass(this.dto, data, {
      excludeExtraneousValues: true,
    });
  }
}

export class TokenSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(TokenDto);
  }
}

export class MessageSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(MessageDto);
  }
}
