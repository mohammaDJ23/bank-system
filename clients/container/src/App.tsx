import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import UnAuthorized from './components/UnAuthorized';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>container home</div>} />
        <Route path="/bank/*" element={<Bank />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
