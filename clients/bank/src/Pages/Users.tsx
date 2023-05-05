import { FC } from 'react';
import AdminProtectionProvider from '../lib/providers/AdminProtectionProvider';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Users: FC = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? `/bank/users/${userInfo.id}` : '/';

  return (
    <AdminProtectionProvider path={path}>
      <ClearStateProvider>
        <UsersContent />
      </ClearStateProvider>
    </AdminProtectionProvider>
  );
};

export default Users;
