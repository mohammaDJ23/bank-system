import { lazy } from 'react';

const CreateUser = lazy(() => import('../Pages/CreateUser'));
const CreateBill = lazy(() => import('../Pages/CreateBill'));
const Users = lazy(() => import('../Pages/Users'));
const Bills = lazy(() => import('../Pages/Bills'));
const Bill = lazy(() => import('../Pages/Bill'));
const User = lazy(() => import('../Pages/User'));
const UpdateBill = lazy(() => import('../Pages/UpdateBill'));
const UpdateUser = lazy(() => import('../Pages/UpdateUser'));

export const routes = [
  { title: 'Create user', path: '/bank/create-user', element: <CreateUser /> },
  { title: 'Create bill', path: '/bank/create-bill', element: <CreateBill /> },
  { title: 'Users', path: '/bank/users', element: <Users /> },
  { title: 'Bills', path: '/bank/bills', element: <Bills /> },
  { title: 'Bill', path: '/bank/bills/:id', element: <Bill /> },
  { title: 'User', path: '/bank/users/:id', element: <User /> },
  { title: 'Update bill', path: '/bank/update-bill/:id', element: <UpdateBill /> },
  { title: 'Update user', path: '/bank/update-user/:id', element: <UpdateUser /> },
];
