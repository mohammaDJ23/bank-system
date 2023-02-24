import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import UnAuthorized from './components/UnAuthorized';
import { pathes } from './lib';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={pathes.initial} element={<div>container home</div>} />
        <Route path={pathes.bank} element={<Bank />} />
        <Route path={pathes.auth} element={<Auth />} />
        <Route path={pathes.unauthorized} element={<UnAuthorized />} />
        <Route path="*" element={<Navigate to={pathes.unauthorized} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
