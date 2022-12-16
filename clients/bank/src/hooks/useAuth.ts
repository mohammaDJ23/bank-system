import { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, getUserRoles } from '../lib';

export function useAuth() {
  return { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, getUserRoles };
}
