import 'reflect-metadata';
import { Route, unstable_HistoryRouter as HistoryRouter, Navigate, Routes } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import 'antd/dist/reset.css';
import './assets/styles/index.scss';
import { Pathes, routes } from './lib';
import { BrowserHistory, MemoryHistory } from 'history';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import HistoryProvider from './components/hoc/HistoryProvider';
import AuthProtectionProvider from './lib/providers/AuthProtectionProvider';
import RedirectionProvider from './lib/providers/RedirectionProvider';

interface AppImportation {
  history: BrowserHistory | MemoryHistory;
}

const App: FC<AppImportation> = props => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={props.history}>
      <Provider store={store}>
        <HistoryProvider history={props.history}>
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RedirectionProvider>
                    {route.needAuth ? (
                      <AuthProtectionProvider>
                        <Navigation>
                          <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                        </Navigation>
                      </AuthProtectionProvider>
                    ) : (
                      <Navigation>
                        <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                      </Navigation>
                    )}
                  </RedirectionProvider>
                }
              />
            ))}
            <Route path="*" element={<Navigate to={Pathes.NOT_FOUND} />} />
          </Routes>
        </HistoryProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
