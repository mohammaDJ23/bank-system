import { FC } from 'react';
import DeletedUserContent from '../components/DeletedUser';
import { Pathes, UserRoles } from '../lib';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';

const DeletedUser: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DELETED_USERS} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <DeletedUserContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default DeletedUser;
