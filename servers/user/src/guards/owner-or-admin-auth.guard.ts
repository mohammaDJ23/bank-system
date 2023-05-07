import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getCurrentUser } from 'src/libs';
import { Roles } from 'src/types';

@Injectable()
export class OwnerOrAdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const currentUser = getCurrentUser(context);
    return currentUser.role === Roles.OWNER || currentUser.role === Roles.ADMIN;
  }
}
