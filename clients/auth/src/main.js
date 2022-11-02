import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './components/Login.vue';
import AdminLogin from './components/AdminLogin.vue';

function mount(element) {
  const routes = [
    { path: '/auth/login', component: Login },
    { path: '/auth/login/admin', component: AdminLogin },
  ];

  const router = createRouter({ history: createWebHistory(), routes });

  createApp(App).use(router).mount(element);
}

if (process.env.NODE_ENV === 'development') {
  const element = document.querySelector('#_auth-service');

  if (element) mount(element);
}

export { mount };
