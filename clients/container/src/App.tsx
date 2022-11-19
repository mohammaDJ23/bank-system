import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import { showPath } from './lib';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {showPath() && (
          <Route path="auth">
            <Route path="*" element={<Auth />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
