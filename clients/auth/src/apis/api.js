import { Login, ForgotPassword, ResetPassword } from '../lib';

export const apis = {
  [Login.name](data) {
    return {
      url: '/auth/login',
      method: 'post',
      data,
    };
  },

  [ForgotPassword.name](data) {
    return {
      url: '/auth/forgot-password',
      method: 'post',
      data,
    };
  },

  [ResetPassword.name](data) {
    return {
      url: '/auth/forgot-password',
      method: 'post',
      data,
    };
  },
};
