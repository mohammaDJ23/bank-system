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

export class CreatedBillObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(CreatedBillDto);
  }
}

export class UpdatedBillObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(UpdatedBillDto);
  }
}

export class DeletedBillObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(DeletedBillDto);
  }
}

export class TotalAmountObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(TotalAmountDto);
  }
}

export class BillQuantitiesObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(BillQuantitiesDto);
  }
}

export class TotalAmountWithoutDatesObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(TotalAmountWithoutDatesDto);
  }
}

export class BillObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(BillDto);
  }
}

export class UserWithBillInfoObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(UserWithBillInfoDto);
  }
}

export class RestoredBillObjectSerializeInterceptor extends ObjectSerializeInterceptor {
  constructor() {
    super(RestoredBillDto);
  }
}
