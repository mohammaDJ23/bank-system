import { decodeToken } from 'react-jwt';
import { Container } from '../types';
import { LocalStorage } from './';

export function getToken(): string {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() < new Date(tokenExpiration).getTime()) return token;

  return '';
}

export function getTokenInfo() {
  return decodeToken<Container.TokenInfo>(getToken());
}

export function isUserAuthenticated() {
  return !!getToken();
}
