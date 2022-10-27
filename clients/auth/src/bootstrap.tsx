import ReactDOM from 'react-dom/client';
import App from './App';
import { isDev } from './lib';

function mount(element: Element): void {
  const root = ReactDOM.createRoot(element);
  root.render(<App />);
}

if (isDev()) {
  const element = document.querySelector('#auth-service');

  if (element) {
    mount(element);
  }
}

export { mount };
