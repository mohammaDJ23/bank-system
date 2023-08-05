import { FC } from 'react';
import BillContent from '../components/Bill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Bill: FC = () => {
  return (
    <ClearStateProvider>
      <BillContent />
    </ClearStateProvider>
  );
};

export default Bill;
