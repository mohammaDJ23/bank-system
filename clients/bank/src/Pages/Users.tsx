import { FC } from 'react';
import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Users: FC = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? `/bank/users/${userInfo.id}` : '/';

  return (
    <ProtectAdminRouteProvider path={path}>
      <ClearStateProvider>
        <UsersContent />
      </ClearStateProvider>
    </ProtectAdminRouteProvider>
  );
};

export default Users;
