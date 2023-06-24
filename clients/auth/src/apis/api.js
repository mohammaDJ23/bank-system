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
      url: '/api/v1/auth/login',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export class LoginWithGoogleApi extends RootApi {
  constructor() {
    super({
      url: '/api/v1/auth/google',
      method: 'get',
    });
  }
}

export class ForgotPasswordApi extends RootApi {
  constructor(data) {
    super({
      url: '/api/v1/auth/forgot-password',
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
      url: '/api/v1/auth/reset-password',
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    });
  }
}
