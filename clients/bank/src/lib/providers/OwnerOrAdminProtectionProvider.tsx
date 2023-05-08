import { FC, PropsWithChildren, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface OwnerOrAdminProtectionProviderImportation {
  path: string;
}

const OwnerOrAdminProtectionProvider: FC<PropsWithChildren<OwnerOrAdminProtectionProviderImportation>> = ({
  children,
  path,
}) => {
  const { isOwner, isAdmin } = useAuth();

  if (isOwner() || isAdmin()) return <Fragment>{children}</Fragment>;
  else return <Navigate to={path} replace />;
};

export default OwnerOrAdminProtectionProvider;
