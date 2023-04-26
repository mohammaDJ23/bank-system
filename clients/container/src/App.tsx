import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from './components/LoadingFallback';
import UserServiceSocketProvider from './components/UserServiceSocketProvider';
import { isUserAuthenticated, Pathes, routes } from './lib';
import './lib/socket';

function App() {
  return (
    <UserServiceSocketProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </UserServiceSocketProvider>
  );
}

export default App;
