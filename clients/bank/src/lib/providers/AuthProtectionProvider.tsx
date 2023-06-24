import { Fragment, FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { isUserAuthenticated } from '../auth';
import { Pathes } from '../routes';

const AuthProtectionProvider: FC<PropsWithChildren> = ({ children }) => {
  return isUserAuthenticated() ? <Fragment>{children}</Fragment> : <Navigate to={Pathes.LOGIN} />;
};

export default AuthProtectionProvider;
