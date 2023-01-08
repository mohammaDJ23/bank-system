import { useList, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from './Skeleton';
import { apis, Apis } from '../../apis';
import List from './List';
import { FC, useEffect } from 'react';

const BillsContent: FC = () => {
  const { list, take, count, page, isEmptyList, onPageChange } = useList<BillObj>({
    initialList: new BillList(),
    apiName: Apis.BILLS,
  });
  const { setLists, isListProcessing } = usePaginationList();
  const { request } = useRequest();
  const isLoading = isListProcessing(Apis.BILLS);

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
      {isLoading ? (
        <Skeleton take={take} />
      ) : isEmptyList ? (
        <EmptyList />
      ) : (
        <List list={list} take={take} count={count} page={page} onPageChange={onPageChange} />
      )}
    </ListContainer>
  );
};

export default BillsContent;
