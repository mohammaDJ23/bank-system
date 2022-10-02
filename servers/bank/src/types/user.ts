export interface CurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}
