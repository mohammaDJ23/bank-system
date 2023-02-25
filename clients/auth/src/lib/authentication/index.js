import { decodeToken } from 'react-jwt';
import { LocalStorage } from '../storage';

export function getToken() {
  const token = LocalStorage.getItem('access_token');
  const tokenExpiration = LocalStorage.getItem('access_token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() < new Date(tokenExpiration).getTime()) return token;

  return '';
}

export function getTokenInfo() {
  return decodeToken(getToken());
}

export function isUserAuthenticated() {
  return !!getToken();
}
