import 'reflect-metadata';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter, Navigate } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import './assets/styles/index.scss';
import { routes } from './lib';
import { BrowserHistory, MemoryHistory } from 'history';
import LoadingFallback from './layout/LoadingFallback';

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
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Navigation>{route.element}</Navigation>
              </Suspense>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HistoryRouter>
  );
};

export default App;
