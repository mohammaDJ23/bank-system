import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';
import Navigation from '../../layout/Navigation';

const BillContent: FC = () => {
  const params = useParams();
  const { isInitialApiProcessing, request } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isInitialBillApiProcessing = isInitialApiProcessing(BillApi);
  const bill = specificDetails.bill;

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request<BillObj, string>(new BillApi(billId).setInitialApi()).then(response => {
        setSpecificDetails('bill', response.data);
      });
    }
  }, []);

  return (
    <Navigation>
      <DefaultContainer>
        {isInitialBillApiProcessing ? <Skeleton /> : bill ? <Details bill={bill} /> : <NotFound />}
      </DefaultContainer>
    </Navigation>
  );
};

export default BillContent;
