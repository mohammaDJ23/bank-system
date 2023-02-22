import BillsContent from '../components/Bills';
import ClearStateProvider from '../lib/providers';

const Bills = () => {
  return (
    <ClearStateProvider>
      <BillsContent />
    </ClearStateProvider>
  );
};

export default Bills;
