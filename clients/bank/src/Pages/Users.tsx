import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';
import UsersContent from '../components/Users';
import { useAuth } from '../hooks';

const Users = () => {
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const path = isUserInfoExist ? `/bank/users/${userInfo.id}` : '/';

  return (
    <ProtectAdminRouteProvider path={path}>
      <UsersContent />
    </ProtectAdminRouteProvider>
  );
};

export default Users;
