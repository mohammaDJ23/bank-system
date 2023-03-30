import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj, Constructor, getTime } from '../../lib';
import EmptyList from './EmptyList';
import Skeleton from './Skeleton';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import List from './List';
import { FC, useCallback, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const listMaker = usePaginationList();
  const { setList, onPageChange, getFullInfo, getListInfo } = listMaker(BillList);
  const { list, isListEmpty, count, page, take, lists } = getFullInfo();
  const isLoading = isInitialApiProcessing(BillsApi);

  const getBillsList = useCallback(
    (options: Partial<BillsApiConstructorType> = {}) => {
      const apiData = { take, page, ...options };
      const billsApi = new BillsApi<BillObj>(apiData);

      if (options.isInitialApi) {
        billsApi.setInitialApi();
      }

      request<[BillObj[], number], BillObj>(billsApi).then(response => {
        let [billList, total] = response.data;
        billList = billList.map(bill =>
          Object.assign<typeof bill, Partial<typeof bill>>(bill, { date: getTime(bill.date) })
        );
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
      if (newPage === page || isLoading) return;

      onPageChange(newPage);

      if (!lists[newPage]) {
        getBillsList({ page: newPage });
      }
    },
    [page, isLoading, lists, getBillsList, onPageChange]
  );

  return (
    <ListContainer>
      {isLoading ? (
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
