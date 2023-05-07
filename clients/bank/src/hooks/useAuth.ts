import { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, isOwner, getUserRoles } from '../lib';

export function useAuth() {
  return { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, isOwner, getUserRoles };
}
