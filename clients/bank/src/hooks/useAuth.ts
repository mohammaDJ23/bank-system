import {
  getToken,
  getTokenInfo,
  isUserAuthenticated,
  isUser,
  isAdmin,
  isOwner,
  getUserRoles,
  isSameUser,
} from '../lib';

export function useAuth() {
  return { getToken, getTokenInfo, isUserAuthenticated, isUser, isAdmin, isOwner, getUserRoles, isSameUser };
}
