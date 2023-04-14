import 'reflect-metadata';
import { Route, unstable_HistoryRouter as HistoryRouter, Navigate, Routes } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';
import 'antd/dist/reset.css';
import './assets/styles/index.scss';
import { isDevelopment, Pathes, routes } from './lib';
import { createBrowserHistory, createMemoryHistory } from 'history';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import HistoryProvider from './components/hoc/HistoryProvider';
import AuthProtectionProvider from './lib/providers/AuthProtectionProvider';
import RedirectionProvider from './lib/providers/RedirectionProvider';

export const history = isDevelopment()
  ? createBrowserHistory()
  : createMemoryHistory({
      initialEntries: [window.location.pathname],
    });

const App: FC = () => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={history}>
      <Provider store={store}>
        <HistoryProvider history={history}>
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
            <Route path="/auth/*" element={<Navigate to={Pathes.LOGIN} />} />
            <Route path="*" element={<Navigate to={Pathes.NOT_FOUND} />} />
          </Routes>
        </HistoryProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
