export interface EncryptedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiration: number;
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}
