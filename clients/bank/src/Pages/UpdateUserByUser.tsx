import UpdateUserByUserContent from '../components/UpdateUserByUser';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateUserByUser = () => {
  return (
    <ClearStateProvider>
      <UpdateUserByUserContent />
    </ClearStateProvider>
  );
};

export default UpdateUserByUser;
