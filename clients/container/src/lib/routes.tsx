import { lazy } from 'react';

const Auth = lazy(() => import('../components/Auth'));
const Bank = lazy(() => import('../components/Bank'));

export enum Pathes {
  NOT_FOUND = '/not-found',
  BANK = '/bank/*',
  DASHBOARD = '/bank/dashboard',
  AUTH = '/auth/*',
  LOGIN = '/auth/login',
}

export const routes = [
  { path: Pathes.AUTH, element: <Auth /> },
  { path: Pathes.BANK, element: <Bank /> },
];
