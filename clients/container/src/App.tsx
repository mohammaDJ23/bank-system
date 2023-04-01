import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import UnAuthorized from './components/UnAuthorized';
import UserServiceSocketProvider from './components/UserServiceSocketProvider';
import { pathes } from './lib';
import './lib/socket';

function App() {
  return (
    <UserServiceSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path={pathes.bank} element={<Bank />} />
          <Route path={pathes.auth} element={<Auth />} />
          <Route path={pathes.unauthorized} element={<UnAuthorized />} />
          <Route path="*" element={<Navigate to={pathes.unauthorized} />} />
        </Routes>
      </BrowserRouter>
    </UserServiceSocketProvider>
  );
}

export default App;
