import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from './Skeleton';
import { BillsApi } from '../../apis';
import List from './List';
import { FC, useCallback, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const listMaker = usePaginationList();
  const { setList, onPageChange, getFullInfo } = listMaker(BillList);
  const { list, isListEmpty, count, page, take } = getFullInfo();
  const isLoading = isInitialApiProcessing(BillsApi);

  const getBillsList = useCallback(() => {
    request<[BillObj[], number]>(new BillsApi<BillObj>({ take, page })).then(res => {
      const [billlist, total] = res.data;
      const constructedBilllist = new BillList();
      constructedBilllist.list[constructedBilllist.page] = billlist;
      constructedBilllist.total = total;
      setList(constructedBilllist);
    });
  }, [take, page, request, setList]);

  useEffect(() => {
    getBillsList();
    return () => setList(new BillList());
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      if (newPage === page || isLoading) return;
      onPageChange(newPage);
      getBillsList();
    },
    [page, isLoading, getBillsList, onPageChange]
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
