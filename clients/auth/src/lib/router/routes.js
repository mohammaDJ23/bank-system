import { isUserAuthenticated } from '../authentication';
import { history } from '../../main';

const Login = () => import('../../pages/Login.vue');
const ResetPassword = () => import('../../pages/ResetPassword.vue');
const ForgotPassword = () => import('../../pages/ForgotPassword.vue');

export const pathes = {
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
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
      else if (isUserAuthenticated()) history.push(pathes.dashboard);
      else next();
    },
  },
  {
    path: pathes.forgotPassword,
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) history.push(pathes.dashboard);
      else next();
    },
  },
  {
    path: '/user/:catchAll(.*)*',
    name: 'NotFound',
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) history.push(pathes.dashboard);
      else next(pathes.login);
    },
  },
];
