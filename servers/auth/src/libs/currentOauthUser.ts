import { ExecutionContext } from '@nestjs/common';
import { OauthUser } from 'src/types';
import { getRequest } from './request';

export function getCurrentOauthUser(context: ExecutionContext): OauthUser {
  const request = getRequest(context);
  return request.user;
}
