import { FC } from 'react';
import CreateBillContent from '../components/CreateBill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const CreateBill: FC = () => {
  return (
    <ClearStateProvider>
      <CreateBillContent />
    </ClearStateProvider>
  );
};

export default CreateBill;
