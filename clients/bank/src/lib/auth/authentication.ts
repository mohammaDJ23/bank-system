import { decodeToken } from 'react-jwt';
import { LocalStorage } from '../';

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export interface TokenInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  expiration: string;
}

export function getToken(): string {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() < new Date(tokenExpiration).getTime()) return token;

  return '';
}

export function getTokenInfo() {
  return decodeToken<TokenInfo>(getToken());
}

export function isUserAuthenticated() {
  return !!getToken();
}

export function isUser() {
  return getTokenInfo()?.role === UserRoles.USER;
}

export function isAdmin() {
  return getTokenInfo()?.role === UserRoles.ADMIN;
}
