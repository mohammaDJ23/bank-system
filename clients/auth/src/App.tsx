import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';

function App() {
  let routes = useRoutes([
    { path: '/login', element: <Login /> },
    { path: '/login/admin', element: <LoginAdmin /> },
  ]);

  return <Router basename="/auth">{routes}</Router>;
}

export default App;
