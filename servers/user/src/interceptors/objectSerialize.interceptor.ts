import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { DeletedUserDto, UserDto, UserQuantitiesDto } from 'src/dtos';
import { ClassConstructor } from 'src/types';

export class ObjectSerializeInterceptor implements NestInterceptor {
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

export class UserObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(UserDto);
  }
}

export class DeletedUserObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(DeletedUserDto);
  }
}

export class UserQuantitiesObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(UserQuantitiesDto);
  }
}
