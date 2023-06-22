import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from '../shared/BillSkeleton';
import { DeletedBillApi } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const DeletedBillContent: FC = () => {
  const params = useParams();
  const { isInitialApiProcessing, request } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isInitialDeletedBillApiProcessing = isInitialApiProcessing(DeletedBillApi);
  const deletedBill = specificDetails.deletedBill;

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request<BillObj, string>(new DeletedBillApi(billId).setInitialApi()).then(response => {
        setSpecificDetails('deletedBill', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialDeletedBillApiProcessing ? <Skeleton /> : deletedBill ? <Details bill={deletedBill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default DeletedBillContent;
