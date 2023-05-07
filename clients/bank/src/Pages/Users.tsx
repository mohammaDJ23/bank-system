import { FC } from 'react';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes } from '../lib';
import OwnerOrAdminProtectionProvider from '../lib/providers/OwnerOrAdminProtectionProvider';

const Users: FC = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? getDynamicPath(Pathes.USER, { id: userInfo.id }) : Pathes.LOGIN;

  return (
    <OwnerOrAdminProtectionProvider path={path}>
      <ClearStateProvider>
        <UsersContent />
      </ClearStateProvider>
    </OwnerOrAdminProtectionProvider>
  );
};

export default Users;
