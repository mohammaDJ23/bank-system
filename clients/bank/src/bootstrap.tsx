/// <reference path="./index.d.ts" />

import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isDevelopment } from './lib';

export const history = createBrowserHistory();

function app(el: Element) {
  const root = ReactDOM.createRoot(el);

  return {
    mount() {
      root.render(<App />);
    },
    unMount() {
      root.unmount();
    },
  };
}

if (isDevelopment()) {
  const el = document.querySelector('#_bank-service');
  if (el) app(el).mount();
}

export { app };
