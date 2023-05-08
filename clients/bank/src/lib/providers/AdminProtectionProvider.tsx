import { FC, PropsWithChildren, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface AdminProtectionProviderImportation {
  path: string;
}

const AdminProtectionProvider: FC<PropsWithChildren<AdminProtectionProviderImportation>> = ({ children, path }) => {
  const { isAdmin } = useAuth();

  if (isAdmin()) return <Fragment>{children}</Fragment>;
  else return <Navigate to={path} replace />;
};

export default AdminProtectionProvider;
