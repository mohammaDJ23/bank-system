import { createApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import { routes } from './lib';
import App from './App.vue';
import { store } from './store';
import './assets/styles/index.scss';

const history = createWebHistory();
export let router = createRouter({ history, routes });

function mount(element, { history, onChildNavigate, initialPath }) {
  history = history || createMemoryHistory(initialPath || '/');

  router.afterEach(guard => {
    onChildNavigate && onChildNavigate(guard.path);
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

  if (element) mount(element, { history });
}

export { mount };
