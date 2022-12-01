import { getItem } from './localStorage';

export function isUserAuthenticated() {
  const token = getItem<string>('token');
  const tokenExpiration = getItem<Date>('token_expiration');

  if (token && tokenExpiration)
    if (new Date().getTime() > new Date(tokenExpiration).getTime()) return token;

  return null;
}
