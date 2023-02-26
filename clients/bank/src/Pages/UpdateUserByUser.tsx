import { FC } from 'react';
import UpdateUserByUserContent from '../components/UpdateUserByUser';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateUserByUser: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateUserByUserContent />
    </ClearStateProvider>
  );
};

export default UpdateUserByUser;
