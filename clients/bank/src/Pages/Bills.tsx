import { FC } from 'react';
import BillsContent from '../components/Bills';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Bills: FC = () => {
  return (
    <ClearStateProvider>
      <BillsContent />
    </ClearStateProvider>
  );
};

export default Bills;
