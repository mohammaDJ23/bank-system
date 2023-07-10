import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getCurrentOauthUser } from 'src/libs';

export const CurrentOauthUser = createParamDecorator(
  (data: string, context: ExecutionContext) => getCurrentOauthUser(context),
);
