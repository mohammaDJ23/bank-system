import { FC, PropsWithChildren, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { UserRoles } from '../auth';

interface UserRoleProtectionProviderImportation {
  path: string;
  roles: UserRoles[];
}

const UserRoleProtectionProvider: FC<PropsWithChildren<UserRoleProtectionProviderImportation>> = ({
  children,
  path,
  roles,
}) => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();

  if (roles.some(role => role === userInfo?.role)) return <Fragment>{children}</Fragment>;
  else return <Navigate to={path} replace />;
};

export default UserRoleProtectionProvider;
