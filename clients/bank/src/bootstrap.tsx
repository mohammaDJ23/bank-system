/// <reference path="./index.d.ts" />

import ReactDOM from 'react-dom/client';
import App from './App';
import { isDevelopment } from './lib';

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
