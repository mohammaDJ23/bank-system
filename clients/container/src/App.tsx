import { Suspense } from 'react';
import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from './components/LoadingFallback';
import UserServiceSocketProvider from './components/UserServiceSocketProvider';
import { isUserAuthenticated, Pathes, routes } from './lib';
import './lib/socket';

export const history = createBrowserHistory();

function App() {
  return (
    <UserServiceSocketProvider>
      {/**@ts-ignore */}
      <HistoryRouter history={history}>
        <Routes>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>}
            />
          ))}
          <Route path="*" element={<Navigate to={isUserAuthenticated() ? Pathes.DASHBOARD : Pathes.LOGIN} />} />
        </Routes>
      </HistoryRouter>
    </UserServiceSocketProvider>
  );
}

export default App;
