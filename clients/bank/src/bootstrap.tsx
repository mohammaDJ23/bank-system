/// <reference path="./index.d.ts" />

import ReactDOM from 'react-dom/client';
import { BrowserHistory, createBrowserHistory, createMemoryHistory } from 'history';
import App from './App';

interface MountOptions {
  history: BrowserHistory;
}

function mount(el: Element, mountOptions: Partial<MountOptions> = {}) {
  const history =
    mountOptions.history ||
    createMemoryHistory({
      initialEntries: [window.location.pathname],
    });

  const root = ReactDOM.createRoot(el);
  root.render(<App history={history} />);
}

if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#_bank-service');
  if (el) mount(el, { history: createBrowserHistory() });
}

export { mount };
