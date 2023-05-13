import { FC } from 'react';
import UpdateUserContent from '../components/UpdateUser';
import { Pathes, UserRoles } from '../lib';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';

const UpdateUserByUser: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DASHBOARD} roles={[UserRoles.ADMIN, UserRoles.USER]}>
      <ClearStateProvider>
        <UpdateUserContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default UpdateUserByUser;
