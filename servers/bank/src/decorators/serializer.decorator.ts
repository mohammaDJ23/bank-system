import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/interceptors';
import {
  ArraySerial,
  ObjectSerial,
  SerialConstructor,
  ClassConstructor,
  ListSerial,
} from 'src/types';

export function serializer(serialConstructor: SerialConstructor) {
  return UseInterceptors(new SerializeInterceptor(serialConstructor));
}

export function ListSerializer(dto: ClassConstructor) {
  return serializer(new ListSerial(dto));
}

export function ArraySerializer(dto: ClassConstructor) {
  return serializer(new ArraySerial(dto));
}

export function ObjectSerializer(dto: ClassConstructor) {
  return serializer(new ObjectSerial(dto));
}
