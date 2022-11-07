import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import { routes } from './lib';
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

function mount(element, { onChildNavigate } = mountOptions) {
  const history = createWebHistory();
  const router = createRouter({ history, routes });

  router.afterEach(({ path }) => {
    onChildNavigate(path);
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
