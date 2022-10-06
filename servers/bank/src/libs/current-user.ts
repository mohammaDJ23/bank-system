import { ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { getRequest } from './request';

export function getCurrentUser(context: ExecutionContext): User {
  const request = getRequest(context);
  return request.currentUser;
}
