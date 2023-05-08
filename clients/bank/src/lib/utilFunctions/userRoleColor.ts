import { UserRoles } from '../auth';

export function getUserRoleColor(role: UserRoles): string {
  return role === UserRoles.OWNER
    ? '#FF0000'
    : role === UserRoles.ADMIN
    ? '#0023FF'
    : role === UserRoles.USER
    ? '#FFD000'
    : '';
}
