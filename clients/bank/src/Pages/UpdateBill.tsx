import { FC } from 'react';
import UpdateBillContent from '../components/UpdateBill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const UpdateBill: FC = () => {
  return (
    <ClearStateProvider>
      <UpdateBillContent />
    </ClearStateProvider>
  );
};

export default UpdateBill;
