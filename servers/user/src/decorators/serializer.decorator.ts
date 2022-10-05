import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serializer(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
