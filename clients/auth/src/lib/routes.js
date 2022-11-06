import Login from '../pages/Login.vue';
import ResetPassword from '../pages/ResetPassword.vue';

export const routes = [
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/:catchAll(.*)*', redirect: '/auth/login' },
];
