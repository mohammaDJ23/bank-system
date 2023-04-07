/// <reference path="./index.d.ts" />

import ReactDOM from 'react-dom/client';
import App from './App';
import { isDevelopment } from './lib';

function mount(el: Element) {
  const root = ReactDOM.createRoot(el);
  root.render(<App />);
}

if (isDevelopment()) {
  const el = document.querySelector('#_bank-service');
  if (el) mount(el);
}

export { mount };
