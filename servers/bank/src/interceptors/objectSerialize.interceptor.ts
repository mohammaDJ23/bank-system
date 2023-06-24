import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import {
  BillDto,
  BillQuantitiesDto,
  CreatedBillDto,
  DeletedBillDto,
  RestoredBillDto,
  TotalAmountDto,
  TotalAmountWithoutDatesDto,
  UpdatedBillDto,
  UserWithBillInfoDto,
} from 'src/dtos';
import { ClassConstructor } from 'src/types';

export class ObjectSerializerInterceptor implements NestInterceptor {
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

export class CreatedBillSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(CreatedBillDto);
  }
}

export class UpdatedBillSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(UpdatedBillDto);
  }
}

export class DeletedBillSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(DeletedBillDto);
  }
}

export class TotalAmountSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(TotalAmountDto);
  }
}

export class BillQuantitiesSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(BillQuantitiesDto);
  }
}

export class TotalAmountWithoutDatesSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(TotalAmountWithoutDatesDto);
  }
}

export class BillSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(BillDto);
  }
}

export class UserWithBillInfoSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(UserWithBillInfoDto);
  }
}

export class RestoredBillSerializerInterceptor extends ObjectSerializerInterceptor {
  constructor() {
    super(RestoredBillDto);
  }
}
