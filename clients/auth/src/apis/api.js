import { Login, ForgotPassword, ResetPassword } from '../lib';

export const apis = {
  [Login.name](data) {
    return {
      url: '/auth/login',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    };
  },

  [ForgotPassword.name](data) {
    return {
      url: '/auth/forgot-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    };
  },

  [ResetPassword.name](data) {
    return {
      url: '/auth/forgot-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    };
  },
};
