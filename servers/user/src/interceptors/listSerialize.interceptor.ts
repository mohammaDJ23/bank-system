import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserDto } from 'src/dtos';
import { ClassConstructor, ListObj } from 'src/types';

export class ListSerializerInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: ListObj) => {
        let [list, quantity] = data;
        list = list.map((item) => this.plainToClass(item));
        return [list, quantity];
      }),
    );
  }

  plainToClass(data: any) {
    return plainToClass(this.dto, data, {
      excludeExtraneousValues: true,
    });
  }
}

export class UsersSerializerInterceptor extends ListSerializerInterceptor {
  constructor() {
    super(UserDto);
  }
}
