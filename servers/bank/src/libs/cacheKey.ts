import { ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from './currentUser';

export function getCacheKey(context: ExecutionContext): string {
  const currentUser = getCurrentUser(context);
  const userServiceId = currentUser.userServiceId;
  return `${userServiceId}.${process.env.PORT}`;
}
