import { ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from './currentUser';
import { getRpcData } from './request';
import { CurrentUserObj } from 'src/types';

export function getCacheKey(context: ExecutionContext): string {
  const currentUser = getCurrentUser(context);
  const userServiceId = currentUser.userServiceId;
  return `${userServiceId}.${process.env.PORT}`;
}

export function getCacheKeyForMicroservice(context: ExecutionContext): string {
  const rpcData = getRpcData<CurrentUserObj>(context);
  const id = rpcData.currentUser.id;
  return `${id}.${process.env.PORT}`;
}
