import { FC } from 'react';
import { useParams } from 'react-router-dom';
import OwnerProtectionProvider from '../lib/providers/OwnerProtectionProvider';
import UpdateUserByOwnerContent from '../components/UpdateUserByOwner';
import ClearStateProvider from '../lib/providers/ClearStateProvider';
import { getDynamicPath, Pathes } from '../lib';

const UpdateUserByOwner: FC = () => {
  const params = useParams();

  return (
    <OwnerProtectionProvider path={getDynamicPath(Pathes.USER, { id: params.id! })}>
      <ClearStateProvider>
        <UpdateUserByOwnerContent />
      </ClearStateProvider>
    </OwnerProtectionProvider>
  );
};

export default UpdateUserByOwner;
