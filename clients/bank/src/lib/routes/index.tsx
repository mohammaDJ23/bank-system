import { lazy } from 'react';

const Bill = lazy(() => import('../../Pages/Bill'));
const Bills = lazy(() => import('../../Pages/Bills'));
const CreateBill = lazy(() => import('../../Pages/CreateBill'));
const CreateUser = lazy(() => import('../../Pages/CreateUser'));
const UpdateBill = lazy(() => import('../../Pages/UpdateBill'));
const UpdateUserByAdmin = lazy(() => import('../../Pages/UpdateUserByAdmin'));
const UpdateUserByUser = lazy(() => import('../../Pages/UpdateUserByUser'));
const User = lazy(() => import('../../Pages/User'));
const Users = lazy(() => import('../../Pages/Users'));
const Dashboard = lazy(() => import('../../Pages/Dashboard'));

export enum Pathes {
  INITIAL = '/',
  LOGIN = '/auth/login',
  DASHBOARD = '/bank/dashboard',
  BILLS = '/bank/bills',
  USERS = '/bank/users',
  CREATE_BILL = '/bank/create-bill',
  CREATE_USER = '/bank/create-user',
  UPDATE_USER_BY_ADMIN = '/bank/admin/update-user/:id',
  UPDATE_BILL = '/bank/update-bill/:id',
  UPDATE_USER = '/bank/update-user/:id',
  USER = '/bank/users/:id',
  BILL = '/bank/bills/:id',
  UN_AUTHORIZED = '/bank/unauthorized',
}

export const routes = [
  { title: 'Dashboard', path: Pathes.DASHBOARD, element: <Dashboard /> },
  { title: 'Bills', path: Pathes.BILLS, element: <Bills /> },
  { title: 'Users', path: Pathes.USERS, element: <Users /> },
  { title: 'Create bill', path: Pathes.CREATE_BILL, element: <CreateBill /> },
  { title: 'Create user', path: Pathes.CREATE_USER, element: <CreateUser /> },
  {
    title: 'Update user by admin',
    path: Pathes.UPDATE_USER_BY_ADMIN,
    element: <UpdateUserByAdmin />,
  },
  { title: 'Update bill', path: Pathes.UPDATE_BILL, element: <UpdateBill /> },
  { title: 'Update user', path: Pathes.UPDATE_USER, element: <UpdateUserByUser /> },
  { title: 'User', path: Pathes.USER, element: <User /> },
  { title: 'Bill', path: Pathes.BILL, element: <Bill /> },
];
