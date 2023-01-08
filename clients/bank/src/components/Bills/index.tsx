import { useList, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from './Skeleton';
import { apis, Apis } from '../../apis';
import List from './List';
import { FC, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request } = useRequest();
  const { setLists, isListProcessing, getList, onPageChange, isListEmpty } = usePaginationList();

  useEffect(() => {
    request<[BillObj[], number]>({
      apiName: Apis.BILLS,
      data: apis[Apis.BILLS]({ take: 5, page: 1 }),
    }).then(res => {
      const [billlist, total] = res.data;
      const constructedBilllist = new BillList();
      constructedBilllist.list[constructedBilllist.page] = billlist;
      constructedBilllist.total = total;
      setLists(constructedBilllist);
    });
  }, []);

  return (
    <ListContainer>
      {/* {isLoading ? (
        <Skeleton take={take} />
      ) : isEmptyList ? (
        <EmptyList />
      ) : (
        <List list={list} take={take} count={count} page={page} onPageChange={onPageChange} />
      )} */}
    </ListContainer>
  );
};

export default BillsContent;
