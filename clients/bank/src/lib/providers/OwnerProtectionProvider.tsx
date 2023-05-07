import { FC, PropsWithChildren, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface OwnerProtectionProviderImportation {
  path: string;
}

const OwnerProtectionProvider: FC<PropsWithChildren<OwnerProtectionProviderImportation>> = ({ children, path }) => {
  const { isOwner } = useAuth();

  if (isOwner()) return <Fragment>{children}</Fragment>;
  else return <Navigate to={path} replace />;
};

export default OwnerProtectionProvider;
