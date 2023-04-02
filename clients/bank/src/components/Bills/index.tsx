import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj, Constructor } from '../../lib';
import EmptyList from './EmptyList';
import Skeleton from './Skeleton';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import List from './List';
import { FC, useCallback, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { setList, onPageChange, getFullInfo, getListInfo } = usePaginationList(BillList);
  const { list, isListEmpty, count, page, take, lists } = getFullInfo();
  const isInitialBillsApiProcessing = isInitialApiProcessing(BillsApi);
  const isBillsApiProcessing = isApiProcessing(BillsApi);

  const getBillsList = useCallback(
    (options: Partial<BillsApiConstructorType> = {}) => {
      const apiData = { take, page, ...options };
      const billsApi = new BillsApi<BillObj>(apiData);

      if (apiData.isInitialApi) {
        billsApi.setInitialApi();
      }

      request<[BillObj[], number], BillObj>(billsApi).then(response => {
        let [billList, total] = response.data;
        const createdList = getListInfo();
        const constructedBilllist = new (createdList.constructor as Constructor<BillList>)();
        constructedBilllist.list = Object.assign(lists, { [apiData.page]: billList });
        constructedBilllist.total = total;
        constructedBilllist.page = apiData.page;
        setList(constructedBilllist);
      });
    },
    [take, page, lists, request, setList, getListInfo]
  );

  useEffect(() => {
    getBillsList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      onPageChange(newPage);

      if (newPage === page || isBillsApiProcessing) return;

      if (!lists[newPage]) {
        getBillsList({ page: newPage });
      }
    },
    [page, isBillsApiProcessing, lists, getBillsList, onPageChange]
  );

  return (
    <ListContainer>
      {isInitialBillsApiProcessing || isBillsApiProcessing ? (
        <Skeleton take={take} />
      ) : isListEmpty ? (
        <EmptyList />
      ) : (
        <List list={list} take={take} count={count} page={page} onPageChange={changePage} />
      )}
    </ListContainer>
  );
};

export default BillsContent;
