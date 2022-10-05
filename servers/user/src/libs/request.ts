import { ExecutionContext } from '@nestjs/common';
import { Request } from '../types/overwrites';

export function getRequest(context: ExecutionContext): Request {
  return context.switchToHttp().getRequest();
}
