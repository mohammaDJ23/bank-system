import { lazy } from 'react';

const Bill = lazy(() => import('../../Pages/Bill'));
const Bills = lazy(() => import('../../Pages/Bills'));
const CreateBill = lazy(() => import('../../Pages/CreateBill'));
const CreateUser = lazy(() => import('../../Pages/CreateUser'));
const UpdateBill = lazy(() => import('../../Pages/UpdateBill'));
const UpdateUserByAdmin = lazy(() => import('../../Pages/UpdateUserByAdmin'));
const User = lazy(() => import('../../Pages/User'));
const Users = lazy(() => import('../../Pages/Users'));

export const routes = [
  { title: 'Bills', path: '/bank/bills', element: <Bills /> },
  { title: 'Users', path: '/bank/users', element: <Users /> },
  { title: 'Create bill', path: '/bank/create-bill', element: <CreateBill /> },
  { title: 'Create user', path: '/bank/create-user', element: <CreateUser /> },
  { title: 'Update bill', path: '/bank/update-bill/:id', element: <UpdateBill /> },
  {
    title: 'Update user by admin',
    path: '/bank/admin/update-user/:id',
    element: <UpdateUserByAdmin />,
  },
  { title: 'User', path: '/bank/users/:id', element: <User /> },
  { title: 'Bill', path: '/bank/bills/:id', element: <Bill /> },
];
