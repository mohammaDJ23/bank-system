import {
  getToken,
  getTokenInfo,
  isUserAuthenticated,
  isUser,
  isAdmin,
  isOwner,
  getUserRoles,
  isSameUser,
  hasRole,
  hasUserAuthorized,
} from '../lib';

export function useAuth() {
  return {
    getToken,
    getTokenInfo,
    isUserAuthenticated,
    isUser,
    isAdmin,
    isOwner,
    getUserRoles,
    isSameUser,
    hasRole,
    hasUserAuthorized,
  };
}
