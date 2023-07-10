import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentUser, getRequest } from 'src/libs';

export const CurrentUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = getRequest(context);
  request.route.isPrivate = true;
  return getCurrentUser(context);
});
