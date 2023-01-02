import DefaultContainer from '../../layout/DefaultContainer';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../hooks';
import { useEffect, useState } from 'react';
import Skeleton from './Skeleton';
import { apis, Apis } from '../../apis';
import { BillObj } from '../../lib';
import NotFound from './NotFound';
import Details from './Details';

const BillContent = () => {
  const [bill, setBill] = useState<BillObj | null>(null);
  const params = useParams();
  const { isInitialApiProcessing, request } = useRequest();
  const isBillProcessing = isInitialApiProcessing(Apis.BILL);
  const billId = params.id;

  useEffect(() => {
    if (billId) {
      request<BillObj, number>({
        apiName: Apis.BILL,
        data: apis[Apis.BILL](+billId),
        afterRequest(response) {
          setBill(response.data);
        },
      });
    }
  }, [request, billId]);

  return (
    <DefaultContainer>
      {isBillProcessing ? <Skeleton /> : bill ? <Details bill={bill} /> : <NotFound />}
    </DefaultContainer>
  );
};

export default BillContent;
