import Login from '../../pages/Login.vue';
import ResetPassword from '../../pages/ResetPassword.vue';
import ForgotPassword from '../../pages/ForgotPassword.vue';

export const routes = [
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/auth/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/:catchAll(.*)*', redirect: '/auth/login' },
];
