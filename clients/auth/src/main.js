import { createApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import { routes } from './lib';
import App from './App.vue';
import { store } from './store';

export let router = null;

function mount(element, mountOptions) {
  const history = mountOptions.history || createMemoryHistory(mountOptions.initialPath || '/');

  router = createRouter({ history, routes });

  router.afterEach(({ path }) => {
    mountOptions.onChildNavigate && mountOptions.onChildNavigate(path);
  });

  const app = createApp(App);

  app.use(router);
  app.use(store);
  app.use(ElementPlus);

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

  if (element) mount(element, { history: createWebHistory() });
}

export { mount };
