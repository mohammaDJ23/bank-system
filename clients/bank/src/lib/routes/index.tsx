import { lazy } from 'react';

interface GetDynamicPathOptions {
  [key: string]: string | number;
}

const Bill = lazy(() => import('../../pages/Bill'));
const Bills = lazy(() => import('../../pages/Bills'));
const CreateBill = lazy(() => import('../../pages/CreateBill'));
const CreateUser = lazy(() => import('../../pages/CreateUser'));
const UpdateBill = lazy(() => import('../../pages/UpdateBill'));
const UpdateUserByOwner = lazy(() => import('../../pages/UpdateUserByOwner'));
const UpdateUserByUser = lazy(() => import('../../pages/UpdateUser'));
const User = lazy(() => import('../../pages/User'));
const Users = lazy(() => import('../../pages/Users'));
const DeletedUsers = lazy(() => import('../../pages/DeletedUsers'));
const Dashboard = lazy(() => import('../../pages/Dashboard'));

export enum Pathes {
  BANK = '/bank/*',
  LOGIN = '/auth/login',
  DASHBOARD = '/bank/dashboard',
  BILLS = '/bank/bills',
  USERS = '/bank/users',
  DELETED_USERS = '/bank/users/deleted',
  CREATE_BILL = '/bank/create-bill',
  CREATE_USER = '/bank/create-user',
  UPDATE_USER_BY_OWNER = '/bank/owner/update-user/:id',
  UPDATE_USER = '/bank/update-user/:id',
  UPDATE_BILL = '/bank/update-bill/:id',
  USER = '/bank/users/:id',
  BILL = '/bank/bills/:id',
}

export const routes = [
  { title: 'Dashboard', path: Pathes.DASHBOARD, element: <Dashboard />, needAuth: true },
  { title: 'Bills', path: Pathes.BILLS, element: <Bills />, needAuth: true },
  { title: 'Users', path: Pathes.USERS, element: <Users />, needAuth: true },
  { title: 'Deleted users', path: Pathes.DELETED_USERS, element: <DeletedUsers />, needAuth: true },
  { title: 'Create bill', path: Pathes.CREATE_BILL, element: <CreateBill />, needAuth: true },
  { title: 'Create user', path: Pathes.CREATE_USER, element: <CreateUser />, needAuth: true },
  { title: 'Update user by owner', path: Pathes.UPDATE_USER_BY_OWNER, element: <UpdateUserByOwner />, needAuth: true },
  { title: 'Update user', path: Pathes.UPDATE_USER, element: <UpdateUserByUser />, needAuth: true },
  { title: 'Update bill', path: Pathes.UPDATE_BILL, element: <UpdateBill />, needAuth: true },
  { title: 'User', path: Pathes.USER, element: <User />, needAuth: true },
  { title: 'Bill', path: Pathes.BILL, element: <Bill />, needAuth: true },
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
