import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getCurrentUser } from 'src/libs';
import { UserRoles } from 'src/types';

@Injectable()
export class OwnerAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const currentUser = getCurrentUser(context);
    return currentUser.role === UserRoles.OWNER;
  }
}
