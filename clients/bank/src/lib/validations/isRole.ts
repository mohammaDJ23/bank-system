import { UserRoles } from '../auth';

export function isRole(value: string): string | undefined {
  const isRoleValid = value === UserRoles.ADMIN || value === UserRoles.USER || value === UserRoles.OWNER;

  if (!isRoleValid) return 'Invalid Role';
}
