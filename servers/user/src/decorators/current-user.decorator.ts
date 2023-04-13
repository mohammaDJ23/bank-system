import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from 'src/libs';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => getCurrentUser(context),
);
