const Login = () => import('../../pages/Login.vue');
const ResetPassword = () => import('../../pages/ResetPassword.vue');
const ForgotPassword = () => import('../../pages/ForgotPassword.vue');
const NotFound = () => import('../../pages/NotFound.vue');

export const pathes = {
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
};

export const routes = [
  { path: pathes.login, name: 'Login', component: Login },
  {
    path: pathes.resetPassword,
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      if (!('token' in to.query)) next(from.path);
      else next();
    },
  },
  { path: pathes.forgotPassword, name: 'ForgotPassword', component: ForgotPassword },
  { path: '/:catchAll(.*)*', name: 'NotFound', component: NotFound },
];
