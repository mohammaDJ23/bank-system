import { useParams } from 'react-router-dom';
import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';
import UpdateUserByAdminContent from '../components/UpdateUserByAdmin';

const UpdateUserByAdmin = () => {
  const params = useParams();

  return (
    <ProtectAdminRouteProvider path={`/bank/users/${params.id}`}>
      <UpdateUserByAdminContent />
    </ProtectAdminRouteProvider>
  );
};

export default UpdateUserByAdmin;
