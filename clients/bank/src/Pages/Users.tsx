import { FC } from 'react';
import AdminProtectionProvider from '../lib/providers/AdminProtectionProvider';
import OwnerProtectionProvider from '../lib/providers/OwnerProtectionProvider';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes } from '../lib';

const Users: FC = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? getDynamicPath(Pathes.USER, { id: userInfo.id }) : Pathes.LOGIN;

  return (
    <OwnerProtectionProvider path={path}>
      <AdminProtectionProvider path={path}>
        <ClearStateProvider>
          <UsersContent />
        </ClearStateProvider>
      </AdminProtectionProvider>
    </OwnerProtectionProvider>
  );
};

export default Users;
