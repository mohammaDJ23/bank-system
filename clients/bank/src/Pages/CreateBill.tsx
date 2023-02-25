import CreateBillContent from '../components/CreateBill';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const CreateBill = () => {
  return (
    <ClearStateProvider>
      <CreateBillContent />
    </ClearStateProvider>
  );
};

export default CreateBill;
