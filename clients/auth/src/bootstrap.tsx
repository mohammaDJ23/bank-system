import ReactDOM from 'react-dom/client';
import App from './App';
import { Env } from './lib';

function mount(element: Element) {
  const root = ReactDOM.createRoot(element);
  root.render(<App />);
}

if (Env.isDev()) {
  const element = document.querySelector('#auth-service-root');

  if (element) {
    mount(element);
  }
}

export { mount };
