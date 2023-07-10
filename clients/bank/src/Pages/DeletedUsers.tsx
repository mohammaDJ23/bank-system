import { FC } from 'react';
import DeletedUsersContent from '../components/DeletedUsers';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { Pathes, UserRoles } from '../lib';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';

const DeletedUsers: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.USERS} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <DeletedUsersContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default DeletedUsers;
