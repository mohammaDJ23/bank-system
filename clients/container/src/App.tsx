import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import RedirectionProvider from './components/RedirectionProvider';
import UserServiceSocketProvider from './components/UserServiceSocketProvider';
import { isUserAuthenticated, pathes } from './lib';
import './lib/socket';

function App() {
  return (
    <UserServiceSocketProvider>
      <BrowserRouter>
        <RedirectionProvider>
          <Routes>
            <Route path={pathes.auth} element={<Auth />} />
            <Route path={pathes.bank} element={<Bank />} />
            <Route path="*" element={<Navigate to={isUserAuthenticated() ? pathes.dashboard : pathes.login} />} />
          </Routes>
        </RedirectionProvider>
      </BrowserRouter>
    </UserServiceSocketProvider>
  );
}

export default App;
