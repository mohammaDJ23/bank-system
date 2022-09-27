import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as User } from '../types/current-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return (request.user as User) || {};
  },
);
