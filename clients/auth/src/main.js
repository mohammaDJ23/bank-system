import 'reflect-metadata';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Notifications from '@kyvg/vue3-notification';
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
import 'bootstrap/dist/css/bootstrap.min.css';

const isDevelopment = process.env.NODE_ENV === 'development';

export const history = createWebHistory();
export const router = createRouter({ history, routes });

function app(el) {
  const app = createApp(App);

  return {
    mount() {
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
      app.use(vuetify);
      app.use(Notifications);

      app.mount(el);
    },
    unMount() {
      app.unmount();
    },
  };
}

if (!isDevelopment) {
  const el = document.querySelector('#_auth-service');
  if (el) app(el).mount();
}

export { app };
