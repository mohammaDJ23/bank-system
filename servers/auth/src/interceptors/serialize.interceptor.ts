import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import {
  ArraySerial,
  ObjectSerial,
  SerialConstructor,
} from 'src/types/serializer';

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: SerialConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // the codes run before the request router

    return handler.handle().pipe(
      map((data: any) => {
        const isResponseList = this.dto instanceof ArraySerial;
        const isResponseObject = this.dto instanceof ObjectSerial;

        switch (true) {
          case isResponseList:
            let [list, quantity] = data;
            list = list.map((item) => this.plainToClass(item));
            return [list, quantity];

          case isResponseObject:
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
