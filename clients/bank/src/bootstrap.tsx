/// <reference path="./index.d.ts" />

import ReactDOM from 'react-dom/client';
import { createBrowserHistory, createMemoryHistory } from 'history';
import App from './App';
import { Bank } from './types';

function mount(el: Element, mountOptions: Bank.MountOptions): Bank.MountExportation {
  const history =
    mountOptions.history ||
    createMemoryHistory({
      initialEntries: [mountOptions.initialPath || '/'],
    });

  history.listen(update => {
    const onChildNavigate = mountOptions?.onChildNavigate;
    if (onChildNavigate) onChildNavigate(update.location.pathname);
  });

  const root = ReactDOM.createRoot(el);
  root.render(<App history={history} />);

  return {
    onParentNavigate(path) {
      if (history.location.pathname !== path) history.push(path);
    },
  };
}

if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#_bank-service');
  if (el) mount(el, { history: createBrowserHistory() });
}

export { mount };
