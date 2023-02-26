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
const UnAuthorized = lazy(() => import('../../Pages/UnAuthorized'));
const NotFound = lazy(() => import('../../Pages/NotFound'));

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
  UNAUTHORIZED = '/bank/unauthorized',
  NOT_FOUND = '/bank/not-found',
}

export const routes = [
  { title: 'Dashboard', path: Pathes.DASHBOARD, element: <Dashboard />, needAuth: true },
  { title: 'Bills', path: Pathes.BILLS, element: <Bills />, needAuth: true },
  { title: 'Users', path: Pathes.USERS, element: <Users />, needAuth: true },
  { title: 'Create bill', path: Pathes.CREATE_BILL, element: <CreateBill />, needAuth: true },
  { title: 'Create user', path: Pathes.CREATE_USER, element: <CreateUser />, needAuth: true },
  {
    title: 'Update user by admin',
    path: Pathes.UPDATE_USER_BY_ADMIN,
    element: <UpdateUserByAdmin />,
    needAuth: true,
  },
  { title: 'Update bill', path: Pathes.UPDATE_BILL, element: <UpdateBill />, needAuth: true },
  { title: 'Update user', path: Pathes.UPDATE_USER, element: <UpdateUserByUser />, needAuth: true },
  { title: 'User', path: Pathes.USER, element: <User />, needAuth: true },
  { title: 'Bill', path: Pathes.BILL, element: <Bill />, needAuth: true },
  { title: 'permission denied', path: Pathes.UNAUTHORIZED, element: <UnAuthorized /> },
  { title: 'NotFound', path: Pathes.NOT_FOUND, element: <NotFound /> },
];
