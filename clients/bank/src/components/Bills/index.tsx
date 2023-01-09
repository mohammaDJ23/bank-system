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
  const { setList, isListEmpty, onPageChange, getCurrentList, getCount, getPage, getTake } =
    listMaker(BillList);

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
        <Skeleton take={getTake()} />
      ) : isListEmpty() ? (
        <EmptyList />
      ) : (
        <List
          list={getCurrentList()}
          take={getTake()}
          count={getCount()}
          page={getPage()}
          onPageChange={onPageChange}
        />
      )}
    </ListContainer>
  );
};

export default BillsContent;
