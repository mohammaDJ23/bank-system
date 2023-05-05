import { FC } from 'react';
import { useParams } from 'react-router-dom';
import ProtectAdminRouteProvider from '../lib/providers/ProtectAdminRouteProvider';
import UpdateUserByAdminContent from '../components/UpdateUserByAdmin';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateUserByAdmin: FC = () => {
  const params = useParams();

  return (
    <ProtectAdminRouteProvider path={`/bank/users/${params.id}`}>
      <ClearStateProvider>
        <UpdateUserByAdminContent />
      </ClearStateProvider>
    </ProtectAdminRouteProvider>
  );
};

export default UpdateUserByAdmin;
