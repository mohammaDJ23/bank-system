import { UserRoles } from '../auth';

export function isRole(value: string): string | undefined {
  const isRoleValid = Object.values(UserRoles).some(role => role === value);

  if (!isRoleValid) return 'Invalid Role';
}
