import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './pages/Login.vue';
import AdminLogin from './pages/AdminLogin.vue';

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

  const app = createApp(App);

  app.use(router);

  app.mount(element);

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
