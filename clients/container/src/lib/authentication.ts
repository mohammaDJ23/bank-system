import { decodeToken } from 'react-jwt';
import { LocalStorage } from './';

export function isUserAuthenticated() {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() < new Date(tokenExpiration).getTime()) return decodeToken(token);

  return null;
}
