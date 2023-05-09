import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/types';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
