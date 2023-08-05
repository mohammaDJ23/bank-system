import { FC } from 'react';
import DeletedBillContent from '../components/DeletedBill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const DeletedBill: FC = () => {
  return (
    <ClearStateProvider>
      <DeletedBillContent />
    </ClearStateProvider>
  );
};

export default DeletedBill;
