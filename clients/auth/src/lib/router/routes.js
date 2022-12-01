const Login = () => import('../../pages/Login.vue');
const ResetPassword = () => import('../../pages/ResetPassword.vue');
const ForgotPassword = () => import('../../pages/ForgotPassword.vue');
const NotFound = () => import('../../pages/NotFound.vue');

export const routes = [
  { path: '/auth/login', name: 'Login', component: Login },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: (to, from, next) => {
      if (!('token' in to.query)) next(from.path);
      else next();
    },
  },
  { path: '/auth/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound },
];
