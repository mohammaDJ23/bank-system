import { ExecutionContext } from '@nestjs/common';
import { CurrentUser as User } from '../types/user';

export function getCurrentUser(context: ExecutionContext): User {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest();
  return request.user;
}
