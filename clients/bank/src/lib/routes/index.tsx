import { lazy } from 'react';

interface GetDynamicPathOptions {
  [key: string]: string | number;
}

const Bill = lazy(() => import('../../Pages/Bill'));
const Bills = lazy(() => import('../../Pages/Bills'));
const CreateBill = lazy(() => import('../../Pages/CreateBill'));
const CreateUser = lazy(() => import('../../Pages/CreateUser'));
const UpdateBill = lazy(() => import('../../Pages/UpdateBill'));
const UpdateUserByOwner = lazy(() => import('../../Pages/UpdateUserByOwner'));
const UpdateUserByUser = lazy(() => import('../../Pages/UpdateUser'));
const User = lazy(() => import('../../Pages/User'));
const Users = lazy(() => import('../../Pages/Users'));
const DeletedUsers = lazy(() => import('../../Pages/DeletedUsers'));
const Dashboard = lazy(() => import('../../Pages/Dashboard'));
const DeletedUser = lazy(() => import('../../Pages/DeletedUser'));
const DeletedBills = lazy(() => import('../../Pages/DeletedBills'));
const DeletedBill = lazy(() => import('../../Pages/DeletedBill'));

export enum Pathes {
  BANK = '/bank/*',
  LOGIN = '/auth/login',
  DASHBOARD = '/bank/dashboard',
  BILLS = '/bank/bills',
  DELETED_bILLS = '/bank/bills/deleted',
  USERS = '/bank/users',
  DELETED_USERS = '/bank/users/deleted',
  CREATE_BILL = '/bank/create-bill',
  CREATE_USER = '/bank/create-user',
  UPDATE_USER_BY_OWNER = '/bank/owner/update-user/:id',
  UPDATE_USER = '/bank/update-user/:id',
  UPDATE_BILL = '/bank/update-bill/:id',
  USER = '/bank/users/:id',
  BILL = '/bank/bills/:id',
  DELETED_USER = '/bank/users/:id/deleted',
  DELETED_BILL = '/bank/bills/:id/deleted',
}

export const routes = [
  { title: 'Dashboard', path: Pathes.DASHBOARD, element: <Dashboard />, needAuth: true },
  { title: 'Bills', path: Pathes.BILLS, element: <Bills />, needAuth: true },
  { title: 'Deleted bills', path: Pathes.DELETED_bILLS, element: <DeletedBills />, needAuth: true },
  { title: 'Users', path: Pathes.USERS, element: <Users />, needAuth: true },
  { title: 'Deleted users', path: Pathes.DELETED_USERS, element: <DeletedUsers />, needAuth: true },
  { title: 'Create bill', path: Pathes.CREATE_BILL, element: <CreateBill />, needAuth: true },
  { title: 'Create user', path: Pathes.CREATE_USER, element: <CreateUser />, needAuth: true },
  { title: 'Update user by owner', path: Pathes.UPDATE_USER_BY_OWNER, element: <UpdateUserByOwner />, needAuth: true },
  { title: 'Update user', path: Pathes.UPDATE_USER, element: <UpdateUserByUser />, needAuth: true },
  { title: 'Update bill', path: Pathes.UPDATE_BILL, element: <UpdateBill />, needAuth: true },
  { title: 'User', path: Pathes.USER, element: <User />, needAuth: true },
  { title: 'Bill', path: Pathes.BILL, element: <Bill />, needAuth: true },
  { title: 'Deleted User', path: Pathes.DELETED_USER, element: <DeletedUser />, needAuth: true },
  { title: 'Deleted Bill', path: Pathes.DELETED_BILL, element: <DeletedBill />, needAuth: true },
];

export function getDynamicPath(path: Pathes, options: GetDynamicPathOptions): string {
  let dynamicQuery = '';
  let newPath: string | Pathes = path;

  for (const key in options) {
    dynamicQuery = `:${key}`;
    if (path.includes(dynamicQuery)) {
      newPath = newPath.replace(dynamicQuery, options[key].toString());
    } else {
      continue;
    }
  }

  return newPath;
}
