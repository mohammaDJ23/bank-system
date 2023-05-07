import { FC } from 'react';
import UpdateUserContent from '../components/UpdateUser';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateUserByUser: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateUserContent />
    </ClearStateProvider>
  );
};

export default UpdateUserByUser;
