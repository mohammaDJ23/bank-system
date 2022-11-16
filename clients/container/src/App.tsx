import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth">
          <Route path="*" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
