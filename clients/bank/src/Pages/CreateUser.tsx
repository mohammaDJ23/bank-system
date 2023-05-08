import { FC } from 'react';
import CreateUserContent from '../components/CreateUser';
import OwnerProtectionProvider from '../lib/providers/OwnerProtectionProvider';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { Pathes } from '../lib';

const CreateUser: FC = () => {
  return (
    <OwnerProtectionProvider path={Pathes.DASHBOARD}>
      <ClearStateProvider>
        <CreateUserContent />
      </ClearStateProvider>
    </OwnerProtectionProvider>
  );
};

export default CreateUser;
