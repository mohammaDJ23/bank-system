import CreateUserContent from '../components/CreateUser';
import ProtectAdminRouteProvider from '../components/hoc/ProtectAdminRouteProvider';

const CreateUser = () => {
  return (
    <ProtectAdminRouteProvider path="/bank/users">
      <CreateUserContent />
    </ProtectAdminRouteProvider>
  );
};

export default CreateUser;
