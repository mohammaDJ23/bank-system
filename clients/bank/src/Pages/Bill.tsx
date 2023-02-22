import BillContent from '../components/Bill';
import ClearStateProvider from '../lib/providers';

const Bill = () => {
  return (
    <ClearStateProvider>
      <BillContent />
    </ClearStateProvider>
  );
};

export default Bill;
