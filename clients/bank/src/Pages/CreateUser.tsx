import { FC } from 'react';
import CreateUserContent from '../components/CreateUser';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { Pathes, UserRoles } from '../lib';

const CreateUser: FC = () => {
  return (
    <UserRoleProtectionProvider path={Pathes.DASHBOARD} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <CreateUserContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default CreateUser;
