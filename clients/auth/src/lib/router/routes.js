import validator from 'validator';
import { isUserAuthenticated } from '../authentication';

const Login = () => import('../../pages/Login.vue');
const ResetPassword = () => import('../../pages/ResetPassword.vue');
const ForgotPassword = () => import('../../pages/ForgotPassword.vue');
const SuccessOauth = () => import('../../pages/SuccessOauth.vue');

export const pathes = {
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  successOauth: '/auth/success-oauth',
  dashboard: '/bank/dashboard',
};

export const routes = [
  {
    path: pathes.login,
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.dashboard);
      else next();
    },
  },
  {
    path: pathes.resetPassword,
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      if (!('token' in to.query)) next(pathes.forgotPassword);
      else if (isUserAuthenticated()) next(pathes.dashboard);
      else next();
    },
  },
  {
    path: pathes.forgotPassword,
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.dashboard);
      else next();
    },
  },
  {
    path: pathes.successOauth,
    name: 'SuccessOauth',
    component: SuccessOauth,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.dashboard);
      else if (!(validator.isJWT(to.query.accessToken) && validator.isJWT(to.query.oauthAccessToken)))
        next(pathes.login);
      else next();
    },
  },
  {
    path: '/auth/:catchAll(.*)*',
    name: 'NotFound',
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.dashboard);
      else next(pathes.login);
    },
  },
];
