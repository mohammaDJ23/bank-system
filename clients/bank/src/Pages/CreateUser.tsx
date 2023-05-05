import { FC } from 'react';
import CreateUserContent from '../components/CreateUser';
import ProtectAdminRouteProvider from '../lib/providers/ProtectAdminRouteProvider';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const CreateUser: FC = () => {
  return (
    <ProtectAdminRouteProvider path="/bank/users">
      <ClearStateProvider>
        <CreateUserContent />
      </ClearStateProvider>
    </ProtectAdminRouteProvider>
  );
};

export default CreateUser;
