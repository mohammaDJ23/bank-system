import { Request as Req } from 'express';
import { User } from 'src/entities';

export interface CurrentUserObj {
  curretUser: User;
}

export interface Request extends Req, CurrentUserObj {}

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

export type ListObj = [any[], number];

export enum CacheKeys {
  USER = 'USER',
  BILLS = 'BILLS',
  BILL = 'BILL',
  QUANTITIES = 'QUANTITIES',
  TOTAL_AMOUNT = 'TOTAL_AMOUNT',
  DELETED_BILLS = 'DELETED_BILLS',
  DELETED_BILL = 'DELETED_BILL',
}

export interface CreatedUserObj extends CurrentUserObj {
  createdUser: User;
}

export interface UpdatedUserObj extends CurrentUserObj {
  updatedUser: User;
}

export interface DeletedUserObj extends CurrentUserObj {
  deletedUser: User;
}

export interface RestoredUserObj extends CurrentUserObj {
  restoredUser: User;
}

export interface CacheKeyOptions {
  isUnique?: boolean;
  isGlobal?: boolean;
}

export interface CacheKeyMetadata {
  key: CacheKeys;
  options: CacheKeyOptions;
}
