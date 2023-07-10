import { FC } from 'react';
import { useParams } from 'react-router-dom';
import UserRoleProtectionProvider from '../lib/providers/UserRoleProtectionProvider';
import UpdateUserByOwnerContent from '../components/UpdateUserByOwner';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes, UserRoles } from '../lib';

const UpdateUserByOwner: FC = () => {
  const params = useParams();

  return (
    <UserRoleProtectionProvider path={getDynamicPath(Pathes.USER, { id: params.id! })} roles={[UserRoles.OWNER]}>
      <ClearStateProvider>
        <UpdateUserByOwnerContent />
      </ClearStateProvider>
    </UserRoleProtectionProvider>
  );
};

export default UpdateUserByOwner;
