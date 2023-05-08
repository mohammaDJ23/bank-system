import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getBody, getCurrentUser, getParams, getQuery } from 'src/libs';
import { Roles } from 'src/types';

@Injectable()
export class IsSameUserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const currentUser = getCurrentUser(context);
    const body = getBody<any>(context);
    const params = getParams(context);
    const query = getQuery(context);
    const userId = +body?.id || +params?.id || +query?.id;

    if (currentUser.role === Roles.OWNER) return true;
    else return currentUser.id === userId;
  }
}
