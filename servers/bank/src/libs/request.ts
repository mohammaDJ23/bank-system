import { ExecutionContext } from '@nestjs/common';
import { Request } from '../types';

export function getRequest<T = Request>(context: ExecutionContext): T {
  return context.switchToHttp().getRequest();
}

export function getRpcData<T = any>(context: ExecutionContext): T {
  return context.switchToRpc().getData();
}
