import UserContent from '../components/User';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const User = () => {
  return (
    <ClearStateProvider>
      <UserContent />
    </ClearStateProvider>
  );
};

export default User;
