import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUser } from 'src/libs';

export const CurrentUser = createParamDecorator((data: string, context: ExecutionContext) =>
  getCurrentUser(context),
);
