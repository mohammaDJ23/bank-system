import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginDto } from 'src/dtos/login.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = (request.user as LoginDto) || {};
    return data ? user[data] : user;
  },
);
