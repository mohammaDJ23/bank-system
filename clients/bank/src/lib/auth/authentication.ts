import { decodeToken } from 'react-jwt';
import { getTime, LocalStorage, UserObj } from '../';

export enum UserRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
}

export interface TokenInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  expiration: number;
}

export interface AccessTokenObj {
  accessToken: string;
}

export function getUserRoles() {
  return [
    { value: UserRoles.OWNER, label: UserRoles.OWNER },
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

export function getTokenInfo(token: string = '') {
  return decodeToken<TokenInfo>(token || getToken());
}

export function reInitializeToken(token: string) {
  const decodedToken = getTokenInfo(token);

  if (decodedToken) {
    LocalStorage.removeItem('access_token');
    LocalStorage.removeItem('access_token_expiration');

    const storableData: [string, string | number][] = [
      ['access_token', token],
      ['access_token_expiration', new Date().getTime() + decodedToken.expiration],
    ];

    for (let [key, value] of storableData) LocalStorage.setItem(key, value);
  }
}

export function isUserAuthenticated() {
  return !!getToken();
}

export function hasRole(...roles: UserRoles[]): boolean {
  roles = roles || Object.values(UserRoles);

  const userInfo = getTokenInfo();

  if (!userInfo) return false;
  else return roles.some(role => userInfo.role === role);
}

export function isUser(role?: UserRoles) {
  return role ? role === UserRoles.USER : hasRole(UserRoles.USER);
}

export function isAdmin(role?: UserRoles) {
  return role ? role === UserRoles.ADMIN : hasRole(UserRoles.ADMIN);
}

export function isOwner(role?: UserRoles) {
  return role ? role === UserRoles.OWNER : hasRole(UserRoles.OWNER);
}

export function isSameUser(id: number) {
  const userInfo = getTokenInfo();
  return id === userInfo?.id;
}

export function hasUserAuthorized(user: UserObj): boolean {
  const isEnteredUserOwner = isOwner();
  const isUserOwner = isOwner(user.role);
  const isUserSame = isSameUser(user.id);
  return isEnteredUserOwner ? (!isUserOwner ? true : isUserSame) : isUserSame;
}
