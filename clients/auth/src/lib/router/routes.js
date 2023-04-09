import { isUserAuthenticated } from '../authentication';

const Login = () => import('../../pages/Login.vue');
const ResetPassword = () => import('../../pages/ResetPassword.vue');
const ForgotPassword = () => import('../../pages/ForgotPassword.vue');
const NotFound = () => import('../../pages/NotFound.vue');
const Initial = () => import('../../pages/Initial.vue');

export const pathes = {
  initial: '/',
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
};

export const routes = [
  {
    path: pathes.initial,
    name: 'Initial',
    component: Initial,
    beforeEnter: (to, from, next) => {
      if (!isUserAuthenticated()) next(pathes.login);
      else next();
    },
  },
  {
    path: pathes.login,
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.initial);
      else next();
    },
  },
  {
    path: pathes.resetPassword,
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      if (!('token' in to.query)) next(pathes.forgotPassword);
      else if (isUserAuthenticated()) next(pathes.initial);
      else next();
    },
  },
  {
    path: pathes.forgotPassword,
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: (to, from, next) => {
      if (isUserAuthenticated()) next(pathes.initial);
      else next();
    },
  },
  { path: '/:catchAll(.*)*', name: 'NotFound', component: NotFound },
];
