import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useAction, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import Skeleton from './Skeleton';
import { BillApi } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';

const BillContent: FC = () => {
  const params = useParams();
  const { isInitialApiProcessing, request } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isBillProcessing = isInitialApiProcessing(BillApi);
  const billId = params.id;
  const bill = specificDetails.bill;

  useEffect(() => {
    if (billId) {
      request<BillObj, number>(new BillApi(+billId)).then(response => {
        setSpecificDetails('bill', response.data);
      });
    }

    return () => {
      setSpecificDetails('bill', null);
    };
  }, []);

  return (
    <DefaultContainer>
      {isBillProcessing ? <Skeleton /> : bill ? <Details bill={bill} /> : <NotFound />}
    </DefaultContainer>
  );
};

export default BillContent;
