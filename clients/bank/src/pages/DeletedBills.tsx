import { FC } from 'react';
import DeletedBillsContent from '../components/DeletedBills';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const DeletedBills: FC = () => {
  return (
    <ClearStateProvider>
      <DeletedBillsContent />
    </ClearStateProvider>
  );
};

export default DeletedBills;
