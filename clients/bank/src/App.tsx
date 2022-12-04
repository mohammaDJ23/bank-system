import { Routes, Route, unstable_HistoryRouter as HistoryRouter, Navigate } from 'react-router-dom';
import { FC } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import './assets/styles/index.scss';
import { routes } from './lib';
import { BrowserHistory, MemoryHistory } from 'history';

interface AppImportation {
  history: BrowserHistory | MemoryHistory;
}

const App: FC<AppImportation> = props => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={props.history}>
      <Routes>
        {routes.map(route => (
          <Route
            path={route.path}
            element={<Navigation key={route.path}>{route.element}</Navigation>}
          />
        ))}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HistoryRouter>
  );
};

export default App;
