import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from './components/LoadingFallback';
import RedirectionProvider from './components/RedirectionProvider';
import UserServiceSocketProvider from './components/UserServiceSocketProvider';
import { isUserAuthenticated, Pathes, routes } from './lib';
import './lib/socket';

function App() {
  return (
    <UserServiceSocketProvider>
      <BrowserRouter>
        <RedirectionProvider>
          <Routes>
            {routes.map(route => (
              <Route path={route.path} element={<Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>} />
            ))}
            <Route path="*" element={<Navigate to={isUserAuthenticated() ? Pathes.DASHBOARD : Pathes.LOGIN} />} />
          </Routes>
        </RedirectionProvider>
      </BrowserRouter>
    </UserServiceSocketProvider>
  );
}

export default App;
