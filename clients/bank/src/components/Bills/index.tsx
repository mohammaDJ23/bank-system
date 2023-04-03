import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from './EmptyList';
import Skeleton from './Skeleton';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import List from './List';
import { FC, useCallback, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const billListInstance = usePaginationList(BillList);
  const billListInfo = billListInstance.getFullInfo();
  const isInitialBillsApiProcessing = isInitialApiProcessing(BillsApi);
  const isBillsApiProcessing = isApiProcessing(BillsApi);

  const getBillsList = useCallback(
    (options: Partial<BillsApiConstructorType> = {}) => {
      const apiData = { take: billListInfo.take, page: billListInfo.page, ...options };
      const billsApi = new BillsApi<BillObj>(apiData);

      if (apiData.isInitialApi) {
        billsApi.setInitialApi();
      }

      request<[BillObj[], number], BillObj>(billsApi).then(response => {
        const [list, total] = response.data;
        billListInstance.insertNewList({ list, total, page: apiData.page });
      });
    },
    [billListInfo, billListInstance, request]
  );

  useEffect(() => {
    getBillsList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      billListInstance.onPageChange(newPage);

      if (billListInstance.isNewPageEqualToCurrentPage(newPage) || isBillsApiProcessing) return;

      getBillsList({ page: newPage });
    },
    [isBillsApiProcessing, billListInstance, getBillsList]
  );

  return (
    <ListContainer>
      {isInitialBillsApiProcessing || isBillsApiProcessing ? (
        <Skeleton take={billListInfo.take} />
      ) : billListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <List listInstance={billListInstance} onPageChange={changePage} />
      )}
    </ListContainer>
  );
};

export default BillsContent;
