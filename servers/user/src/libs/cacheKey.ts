import { ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from './currentUser';

export function getCacheKey(context: ExecutionContext): string {
  const currentUser = getCurrentUser(context);
  const id = currentUser.id;
  return `${id}.${process.env.PORT}`;
}
