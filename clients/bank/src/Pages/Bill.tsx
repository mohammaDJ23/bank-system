import BillContent from '../components/Bill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Bill = () => {
  return (
    <ClearStateProvider>
      <BillContent />
    </ClearStateProvider>
  );
};

export default Bill;
