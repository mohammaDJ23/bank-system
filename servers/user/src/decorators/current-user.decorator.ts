import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from 'src/libs/current-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
