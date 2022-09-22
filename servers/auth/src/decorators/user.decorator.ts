import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../types/user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return (request.user as User) || {};
  },
);
