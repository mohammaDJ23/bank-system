import { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, getUserRoles, isUserInfoExist } from '../lib';

export function useAuth() {
  return { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, getUserRoles, isUserInfoExist };
}
