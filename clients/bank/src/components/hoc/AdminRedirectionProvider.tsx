import { FC, PropsWithChildren, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface AdminRedirectionProviderImportation {
  to?: string;
}

const AdminRedirectionProvider: FC<PropsWithChildren<AdminRedirectionProviderImportation>> = ({
  children,
  to = '/',
}) => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) {
    return <Navigate to={to} replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default AdminRedirectionProvider;
