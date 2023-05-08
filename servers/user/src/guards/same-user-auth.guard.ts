import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getBody, getCurrentUser, getParams, getQuery } from 'src/libs';
import { UserRoles } from 'src/types';

@Injectable()
export class SameUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      'same-users',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const currentUser = getCurrentUser(context);
    const body = getBody<any>(context);
    const params = getParams(context);
    const query = getQuery(context);
    const userId = +body?.id || +params?.id || +query?.id;

    const isRoleMatched = requiredRoles.some(
      (role) => role === currentUser.role,
    );
    if (isRoleMatched) return currentUser.id === userId;
    else return true;
  }
}
