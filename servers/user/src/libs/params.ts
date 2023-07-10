import { ParamsDictionary } from 'express-serve-static-core';
import { ExecutionContext } from '@nestjs/common';
import { getRequest } from './request';

export function getParams<T extends ParamsDictionary = ParamsDictionary>(
  context: ExecutionContext,
): T {
  const request = getRequest(context);
  return request.params as T;
}
