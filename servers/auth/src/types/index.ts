import { Request as Req } from 'express';
import { User } from 'src/entities';

export interface EncryptedUserObj {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiration: number;
}

export interface UserSignInfoObj extends EncryptedUserObj {}

export interface OauthUser {
  id: string;
  email: string;
  accessToken: string;
  expiration: number;
}

export enum Roles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export interface UpdatedUserPartialObj extends Partial<User> {
  id: number;
}

export interface Request extends Req {
  currentUser: User;
  user: undefined | OauthUser;
}

export type Exception =
  | {
      message: string;
      statusCode: number;
      error: string;
    }
  | string;

export enum RabbitMqServices {
  AUTH = 'AUTH_SERVICE',
}

export enum RabbitMqQueue {
  AUTH = 'auth-queue',
  USER = 'user-queue',
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

export class ArraySerial extends SerialConstructor {}

export class ObjectSerial extends SerialConstructor {}
