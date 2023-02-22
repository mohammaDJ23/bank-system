import UserContent from '../components/User';
import ClearStateProvider from '../lib/providers';

const User = () => {
  return (
    <ClearStateProvider>
      <UserContent />
    </ClearStateProvider>
  );
};

export default User;
