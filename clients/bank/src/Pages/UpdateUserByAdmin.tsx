import { FC } from 'react';
import { useParams } from 'react-router-dom';
import AdminProtectionProvider from '../lib/providers/AdminProtectionProvider';
import UpdateUserByAdminContent from '../components/UpdateUserByAdmin';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateUserByAdmin: FC = () => {
  const params = useParams();

  return (
    <AdminProtectionProvider path={`/bank/users/${params.id}`}>
      <ClearStateProvider>
        <UpdateUserByAdminContent />
      </ClearStateProvider>
    </AdminProtectionProvider>
  );
};

export default UpdateUserByAdmin;
