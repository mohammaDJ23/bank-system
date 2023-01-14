import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj, Constructor } from '../../lib';
import EmptyList from '../EmptyList';
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
      request<[BillObj[], number]>(new BillsApi<BillObj>(apiData)).then(res => {
        const [billList, total] = res.data;
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
    getBillsList();
    return () => setList(new BillList());
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
