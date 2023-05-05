import { FC } from 'react';
import CreateUserContent from '../components/CreateUser';
import AdminProtectionProvider from '../lib/providers/AdminProtectionProvider';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const CreateUser: FC = () => {
  return (
    <AdminProtectionProvider path="/bank/users">
      <ClearStateProvider>
        <CreateUserContent />
      </ClearStateProvider>
    </AdminProtectionProvider>
  );
};

export default CreateUser;
