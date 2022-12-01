import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Bank from './components/Bank';
import { isUserAuthenticated } from './lib';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <>
          {!isUserAuthenticated() && (
            <Route path="auth">
              <Route path="*" element={<Auth />} />
            </Route>
          )}

          {isUserAuthenticated() && (
            <Route path="bank">
              <Route path="*" element={<Bank />} />
            </Route>
          )}
        </>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
