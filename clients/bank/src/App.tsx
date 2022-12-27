import 'reflect-metadata';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter, Navigate } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import './assets/styles/index.scss';
import { isMicroFrontEnd, routes } from './lib';
import { BrowserHistory, MemoryHistory } from 'history';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import StateCleanerProvider from './components/hoc/StateCleanerProvider';

interface AppImportation {
  history: BrowserHistory | MemoryHistory;
}

const App: FC<AppImportation> = props => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={props.history}>
      <Provider store={store}>
        <Routes>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <StateCleanerProvider>
                  <Navigation>
                    <Suspense fallback={<LoadingFallback />}> {route.element}</Suspense>
                  </Navigation>
                </StateCleanerProvider>
              }
            />
          ))}

          <Route
            path="*"
            element={<Navigate to={isMicroFrontEnd() ? '/' : '/bank/create-bill'} />}
          />
        </Routes>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
