import { decodeToken } from 'react-jwt';
import { Container } from '../types';
import { LocalStorage } from './';

export function isUserAuthenticated(): null | Container.IsUserAuthenticatedExporation {
  const token = LocalStorage.getItem<string>('access_token');
  const tokenExpiration = LocalStorage.getItem<number>('access_token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() < new Date(tokenExpiration).getTime()) return decodeToken(token);

  return null;
}
