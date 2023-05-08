import { Request as Req } from 'express';
import { User } from 'src/entities';

export interface Request extends Req {
  currentUser: User;
}

export type Exception =
  | {
      message: string;
      statusCode: number;
      error: string;
    }
  | string;

export enum RabbitMqServices {
  BANK = 'BANK_SERVICE',
}

export enum RabbitMqQueue {
  BANK = 'bank-queue',
}

export interface ClassConstructor {
  new (...args: any[]): {};
}

export interface DtoConstructor {
  readonly construct: ClassConstructor;
}

export class SerialConstructor implements DtoConstructor {
  constructor(readonly construct: ClassConstructor) {}
}

export class ListSerial extends SerialConstructor {}

export class ArraySerial extends SerialConstructor {}

export class ObjectSerial extends SerialConstructor {}

export interface EncryptedUserObj {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiration: number;
}

export enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}
