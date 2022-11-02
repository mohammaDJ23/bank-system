import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />}>
          <Route path="login" index element={<Auth />} />
          <Route path="login/admin" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
