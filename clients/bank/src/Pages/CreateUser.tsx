import CreateUserContent from '../components/CreateUser';
import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const CreateUser = () => {
  return (
    <ProtectAdminRouteProvider path="/bank/users">
      <ClearStateProvider>
        <CreateUserContent />
      </ClearStateProvider>
    </ProtectAdminRouteProvider>
  );
};

export default CreateUser;
