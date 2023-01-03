import { useList } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from './Skeleton';
import { Apis } from '../../apis';
import List from './List';
import { FC } from 'react';

const BillsContent: FC = () => {
  const { list, take, count, page, isEmptyList, isListProcessing, onPageChange } = useList<BillObj>(
    { initialList: new BillList(), apiName: Apis.BILLS }
  );

  return (
    <ListContainer>
      {isListProcessing() ? (
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
