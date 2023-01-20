import { createApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import antd from 'ant-design-vue';
import { routes } from './lib';
import App from './App.vue';
import { store } from './store';
import './assets/styles/index.scss';
import 'element-plus/dist/index.css';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  app.use(antd);

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
