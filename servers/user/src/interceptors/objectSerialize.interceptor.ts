import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { DeletedUserDto, UserDto, UserQuantitiesDto } from 'src/dtos';
import { ClassConstructor } from 'src/types';

export class ObjectSerializerInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return this.plainToClass(data);
      }),
    );
  }

  plainToClass(data: any) {
    return plainToClass(this.dto, data, {
      excludeExtraneousValues: true,
    });
  }
}

export class UserSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(UserDto);
  }
}

export class DeletedUserSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(DeletedUserDto);
  }
}

export class UserQuantitiesSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(UserQuantitiesDto);
  }
}
