import BillsContent from '../components/Bills';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Bills = () => {
  return (
    <ClearStateProvider>
      <BillsContent />
    </ClearStateProvider>
  );
};

export default Bills;
