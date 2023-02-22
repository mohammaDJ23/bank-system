import UpdateBillContent from '../components/UpdateBill';
import ClearStateProvider from '../lib/providers';

const UpdateBill = () => {
  return (
    <ClearStateProvider>
      <UpdateBillContent />
    </ClearStateProvider>
  );
};

export default UpdateBill;
