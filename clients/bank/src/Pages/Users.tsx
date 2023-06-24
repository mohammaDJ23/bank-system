import { FC } from 'react';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes, UserRoles } from '../lib';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';

const Users: FC = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? getDynamicPath(Pathes.USER, { id: userInfo.id }) : Pathes.LOGIN;

  return (
    <UserRoleProtectionProvider path={path} roles={[UserRoles.OWNER, UserRoles.ADMIN]}>
      <ClearStateProvider>
        <UsersContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default Users;
