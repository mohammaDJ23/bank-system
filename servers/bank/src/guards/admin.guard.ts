import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CurrentUser, Roles } from 'src/types/user';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user: CurrentUser = request.user || {};
    return user?.role?.toLowerCase() === Roles.ADMIN.toLowerCase();
  }
}
