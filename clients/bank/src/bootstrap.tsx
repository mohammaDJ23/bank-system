/// <reference path="./index.d.ts" />

import ReactDOM from 'react-dom/client';
import { history } from './lib';
import App from './App';
import { Bank } from './types';

function mount(el: Element, mountOptions?: Bank.MountOptions): Bank.MountExportation {
  history.listen(update => {
    const onChildNavigate = mountOptions?.onChildNavigate;
    if (onChildNavigate) onChildNavigate(update.location.pathname);
  });

  const root = ReactDOM.createRoot(el);
  root.render(<App />);

  return {
    onParentNavigate(path) {
      if (history.location.pathname !== path) history.push(path);
    },
  };
}

if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#_bank-service');
  if (el) mount(el);
}

export { mount };
