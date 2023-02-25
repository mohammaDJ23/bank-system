import 'reflect-metadata';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter, Navigate } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import 'antd/dist/reset.css';
import './assets/styles/index.scss';
import { isMicroFrontEnd, isUserAuthenticated, Pathes, routes } from './lib';
import { BrowserHistory, MemoryHistory } from 'history';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import HistoryProvider from './components/hoc/HistoryProvider';
import UnAuthorized from './components/UnAuthorized';

interface AppImportation {
  history: BrowserHistory | MemoryHistory;
}

const App: FC<AppImportation> = props => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={props.history}>
      <Provider store={store}>
        <HistoryProvider history={props.history}>
          {isUserAuthenticated() ? (
            <Routes>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Navigation>
                      <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                    </Navigation>
                  }
                />
              ))}

              <Route
                path="*"
                element={
                  <Navigate to={isMicroFrontEnd() ? Pathes.DASHBOARD : Pathes.CREATE_BILL} />
                }
              />
            </Routes>
          ) : (
            <Routes>
              <Route path={Pathes.UN_AUTHORIZED} element={<UnAuthorized />} />
              <Route path="*" element={<Navigate to={Pathes.UN_AUTHORIZED} replace />} />
            </Routes>
          )}
        </HistoryProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
