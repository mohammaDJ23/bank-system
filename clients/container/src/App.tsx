import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import { isUserAuthenticated } from './lib';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth/*" element={!isUserAuthenticated() ? <Auth /> : <Navigate to="/" />} />
        <Route path="bank/*" element={isUserAuthenticated() ? <Bank /> : <Navigate to="/" />} />
        <Route path="/" element={<div>container home</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
