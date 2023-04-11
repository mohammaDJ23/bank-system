import { ExecutionContext } from '@nestjs/common';
import { User } from '../entities';
import { getRequest } from './request';

export function getCurrentUser(context: ExecutionContext): User {
  const request = getRequest(context);
  return request.user as User;
}
