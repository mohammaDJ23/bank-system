import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/types';

export const SameUser = (...roles: UserRoles[]) =>
  SetMetadata('same-users', roles);
