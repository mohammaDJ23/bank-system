import { FC } from 'react';
import CreateUserContent from '../components/CreateUser';
import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';
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
