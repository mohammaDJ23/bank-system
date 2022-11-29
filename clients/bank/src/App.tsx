import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';

function App() {
  return (
    <BrowserRouter basename="bank">
      <Routes>
        <Route path="create-user" element={<div>create user</div>} />
        <Route path="update-user" element={<div>update user</div>} />
        <Route path="users" element={<div>update user</div>} />
        <Route path="create-bill" element={<div>create bill</div>} />
        <Route path="update-bill" element={<div>update bill</div>} />
        <Route path="bills" element={<div>update bill</div>} />
        <Route path="users/:id" element={<div>update user</div>} />
        <Route path="bills/:id" element={<div>update bill</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
