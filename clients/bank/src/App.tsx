import 'reflect-metadata';
import { Route, unstable_HistoryRouter as HistoryRouter, Navigate, Routes } from 'react-router-dom';
import { FC, Suspense } from 'react';
import Navigation from './layout/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'antd/dist/reset.css';
import './assets/styles/index.scss';
import { isUserAuthenticated, Pathes, routes } from './lib';
import LoadingFallback from './layout/LoadingFallback';
import { Provider } from 'react-redux';
import { store } from './store';
import HistoryProvider from './components/hoc/HistoryProvider';
import AuthProtectionProvider from './lib/providers/AuthProtectionProvider';
import RedirectionProvider from './lib/providers/RedirectionProvider';
import { history } from './bootstrap';

const App: FC = () => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={history}>
      <Provider store={store}>
        <RedirectionProvider>
          <HistoryProvider history={history}>
            <Routes>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.needAuth ? (
                      <AuthProtectionProvider>
                        <Navigation>
                          <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                        </Navigation>
                      </AuthProtectionProvider>
                    ) : (
                      <Navigation>
                        <Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>
                      </Navigation>
                    )
                  }
                />
              ))}
              <Route
                path={Pathes.BANK}
                element={<Navigate to={isUserAuthenticated() ? Pathes.DASHBOARD : Pathes.LOGIN} />}
              />
            </Routes>
          </HistoryProvider>
        </RedirectionProvider>
      </Provider>
    </HistoryRouter>
  );
};

export default App;
