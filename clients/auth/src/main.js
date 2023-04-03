import 'reflect-metadata';
import { createApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import antd from 'ant-design-vue';
import { routes } from './lib';
import App from './App.vue';
import { store } from './store';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import './assets/styles/index.scss';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const isDevelopment = process.env.NODE_ENV === 'development';

const history = isDevelopment ? createWebHistory() : createMemoryHistory(window.location.pathname);
export const router = createRouter({ history, routes });

function mount(element) {
  const app = createApp(App);
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  });

  app.use(router);
  app.use(store);
  app.use(antd);
  app.use(vuetify);

  app.mount(element);
}

if (isDevelopment) {
  const element = document.querySelector('#_auth-service');
  if (element) mount(element);
}

export { mount };
