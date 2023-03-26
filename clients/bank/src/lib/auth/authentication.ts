import { decodeToken } from 'react-jwt';
import { getTime, LocalStorage } from '../';

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

export function getUserRoles() {
  return [
    { value: UserRoles.ADMIN, label: UserRoles.ADMIN },
    { value: UserRoles.USER, label: UserRoles.USER },
  ];
}

export function getToken(): string {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration) if (getTime() < getTime(tokenExpiration)) return token;

  return '';
}

export function getTokenInfo() {
  return decodeToken<TokenInfo>(getToken());
}

export function isUserInfoExist() {
  return !!getTokenInfo();
}

export function isUserAuthenticated() {
  return !!getToken();
}

export function isUser(role?: UserRoles) {
  return (role || getTokenInfo()?.role) === UserRoles.USER;
}

export function isAdmin(role?: UserRoles) {
  return (role || getTokenInfo()?.role) === UserRoles.ADMIN;
}
