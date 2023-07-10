import { Query } from 'express-serve-static-core';
import { ExecutionContext } from '@nestjs/common';
import { getRequest } from './request';

export function getQuery<T extends Query = Query>(
  context: ExecutionContext,
): T {
  const request = getRequest(context);
  return request.query as T;
}
