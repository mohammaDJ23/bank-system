import { UserRoles } from '../auth';

export function isRole(rule: Object, value: string, callback: (error?: Error) => void): void {
  const isRoleValid = value === UserRoles.ADMIN || value === UserRoles.USER;

  if (!isRoleValid) callback(new Error('Invalid Role'));
  else callback();
}
