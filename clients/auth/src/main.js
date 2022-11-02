import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './components/Login.vue';
import AdminLogin from './components/AdminLogin.vue';

const mountOptions = {
  onChildNavigate: function () {},
};

function mount(element, { onChildNavigate } = mountOptions) {
  const routes = [
    { path: '/auth/login', name: 'Login', component: Login },
    { path: '/auth/login/admin', name: 'AdminLogin', component: AdminLogin },
  ];

  const history = createWebHistory();

  const router = createRouter({ history, routes });

  router.afterEach(({ path }) => {
    onChildNavigate(path);
  });

  createApp(App).use(router).mount(element);

  return {
    onParentNavigate: function (path) {
      if (history.location !== path) {
        history.push(path);
      }
    },
  };
}

if (process.env.NODE_ENV === 'development') {
  const element = document.querySelector('#_auth-service');

  if (element) mount(element);
}

export { mount };
