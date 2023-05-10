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
  };
}
