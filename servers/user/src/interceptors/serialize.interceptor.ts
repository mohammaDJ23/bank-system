import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ArraySerial, ObjectSerial, SerialConstructor } from 'src/types';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: SerialConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        switch (true) {
          case this.dto instanceof ArraySerial:
            return data.map((item) => this.plainToClass(item));

          case this.dto instanceof ObjectSerial:
            return this.plainToClass(data);
        }
      }),
    );
  }

  plainToClass(data: any) {
    return plainToClass(this.dto.construct, data, {
      excludeExtraneousValues: true,
    });
  }
}
