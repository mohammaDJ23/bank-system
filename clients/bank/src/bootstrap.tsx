/// <reference path="./index.d.ts" />

import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from 'history';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isDevelopment } from './lib';

interface MountOptions {
  onChildNavigate?: (path: string) => void;
  initialPath?: string;
  history: BrowserHistory | MemoryHistory;
}

interface MountExportation {
  onParentNavigate: (path: string) => void;
}

export const history = isDevelopment() ? createBrowserHistory() : createMemoryHistory();

function app(el: Element) {
  const root = ReactDOM.createRoot(el);

  return {
    mount({
      onChildNavigate = function () {},
      initialPath = '/',
      history = createBrowserHistory(),
    }: MountOptions): MountExportation {
      history.listen(update => {
        onChildNavigate(update.location.pathname);
      });

      root.render(<App history={history} />);

      return {
        onParentNavigate(path: string) {
          if (path !== history.location.pathname) {
            history.push(path);
          }
        },
      };
    },
    unMount() {
      root.unmount();
    },
  };
}

if (isDevelopment()) {
  const el = document.querySelector('#_bank-service');
  if (el) app(el).mount({ history });
}

export { app };
