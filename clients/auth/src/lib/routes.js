import Login from '../pages/Login.vue';

export const routes = [
  { path: '/auth/login', name: 'Login', component: Login },
  { path: '/:CatchAll(.*)*', redirect: '/auth/login' },
];
