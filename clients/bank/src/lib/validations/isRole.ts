export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export function isRole(rule: Object, value: string, callback: (error?: Error) => void): void {
  const isRoleValid = value === Roles.ADMIN || value === Roles.USER;

  if (!isRoleValid) callback(new Error('Invalid Role'));
  else callback();
}
