import { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin } from '../lib';

export function useAuth() {
  return { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin };
}
