import Login from '../pages/Login.vue';
import AdminLogin from '../pages/AdminLogin.vue';

export const routes = [
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/auth/login/admin', name: 'AdminLogin', component: AdminLogin },
];
