import { ForgotPassword, ResetPassword } from '../lib';

class RootApi {
  constructor(api = {}, config = {}) {
    this.api = api;
    this.config = config;
  }

  getConstructorName() {
    return this.constructor.name;
  }
}

export class LoginApi extends RootApi {
  constructor(data) {
    super({
      url: '/auth/login',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class ForgotPasswordApi extends RootApi {
  constructor(data) {
    super({
      url: '/auth/forgot-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class ResetPasswordApi extends RootApi {
  constructor(data) {
    super({
      url: '/auth/reset-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const apis = {
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
      url: '/auth/reset-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    };
  },
};
