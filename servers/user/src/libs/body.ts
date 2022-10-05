import { ExecutionContext } from '@nestjs/common';
import { getRequest } from './request';

export function getBody<T>(context: ExecutionContext): T {
  const request = getRequest(context);
  return request.body;
}
