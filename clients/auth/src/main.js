import { createApp, nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import { decodeToken } from 'react-jwt';
import { isMicroFrontEnd, routes } from './lib';
import App from './App.vue';
import { store } from './store';

const mountOptions = {
  onChildNavigate: function () {},
};

function mountExportation({ history }) {
  return {
    onParentNavigate: function (path) {
      if (history.location !== path) {
        history.push(path);
      }
    },
  };
}

const history = createWebHistory();
export const router = createRouter({ history, routes });

function mount(element, { onChildNavigate } = mountOptions) {
  router.afterEach(({ path }) => {
    onChildNavigate(path);
  });

  router.beforeEach((to, from, next) => {
    if (isMicroFrontEnd()) {
      const splitedCookie = document.cookie.split(';');
      const findedToken = splitedCookie.find(item => item.trim().startsWith('access_token'));
      const findedTokenExpiration = splitedCookie.find(item =>
        item.trim().startsWith('access_token_expiration'),
      );

      if (findedToken && findedTokenExpiration) {
        const [tokenExpirationName, tokenExpiration] = findedTokenExpiration.split('=');

        if (new Date().getTime() > new Date(tokenExpiration).getTime()) next();
        else next('/');
      } else next();
    } else next();
  });

  const app = createApp(App);

  app.use(router);
  app.use(store);
  app.use(ElementPlus);

  app.mount(element);

  return mountExportation({ history });
}

if (process.env.NODE_ENV === 'development') {
  const element = document.querySelector('#_auth-service');

  if (element) mount(element);
}

export { mount };
