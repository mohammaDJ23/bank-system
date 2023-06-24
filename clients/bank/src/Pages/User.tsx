import { FC } from 'react';
import UserContent from '../components/User';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const User: FC = () => {
  return (
    <ClearStateProvider>
      <UserContent />
    </ClearStateProvider>
  );
};

export default User;
