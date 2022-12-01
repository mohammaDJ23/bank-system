import { Routes, Route, unstable_HistoryRouter as HistoryRouter, Navigate } from 'react-router-dom';
import { FC } from 'react';
import { Bank } from './types';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'element-theme-default';

const App: FC<Bank.AppImportation> = props => {
  return (
    /**@ts-ignore */
    <HistoryRouter history={props.history}>
      <Routes>
        <Route path="bank/create-user" element={<div>create user</div>} />
        <Route path="bank/update-user" element={<div>update user</div>} />
        <Route path="bank/users" element={<div>update user</div>} />
        <Route path="bank/create-bill" element={<div>create bill</div>} />
        <Route path="bank/update-bill" element={<div>update bill</div>} />
        <Route path="bank/bills" element={<div>update bill</div>} />
        <Route path="bank/users/:id" element={<div>update user</div>} />
        <Route path="bank/bills/:id" element={<div>update bill</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HistoryRouter>
  );
};

export default App;
