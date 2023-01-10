import { usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from './Skeleton';
import { apis, Apis } from '../../apis';
import List from './List';
import { FC, useEffect } from 'react';

const BillsContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const listMaker = usePaginationList();
  const { setList, onPageChange, getFullInfo } = listMaker(BillList);
  const { list, isListEmpty, count, page, take } = getFullInfo();

  useEffect(() => {
    request<[BillObj[], number]>({
      apiName: Apis.BILLS,
      data: apis[Apis.BILLS]({ take: 5, page: 1 }),
    }).then(res => {
      const [billlist, total] = res.data;
      const constructedBilllist = new BillList();
      constructedBilllist.list[constructedBilllist.page] = billlist;
      constructedBilllist.total = total;
      setList(constructedBilllist);
    });
  }, []);

  return (
    <ListContainer>
      {isInitialApiProcessing(Apis.BILLS) ? (
        <Skeleton take={take} />
      ) : isListEmpty ? (
        <EmptyList />
      ) : (
        <List list={list} take={take} count={count} page={page} onPageChange={onPageChange} />
      )}
    </ListContainer>
  );
};

export default BillsContent;
