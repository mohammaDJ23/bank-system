import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { getBody, getCurrentUser, getParams, getQuery } from 'src/libs';
import { UserService } from 'src/services';
import { UserRoles } from 'src/types';

@Injectable()
export class DifferentOwnerGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const currentUser = getCurrentUser(context);
    const body = getBody<any>(context);
    const params = getParams(context);
    const query = getQuery(context);
    const userId = +body?.id || +params?.id || +query?.id;

    const findedUser = await this.userService.findById(userId);
    if (!findedUser) throw new NotFoundException('Could not found the user.');

    if (
      currentUser.role === UserRoles.OWNER &&
      findedUser.role === UserRoles.OWNER
    )
      return currentUser.id === findedUser.id;
    else return true;
  }
}
