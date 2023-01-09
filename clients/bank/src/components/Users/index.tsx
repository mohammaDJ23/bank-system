import { Apis } from '../../apis';
import { useList } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { UserList, UserObj } from '../../lib';
import EmptyList from '../EmptyList';
import List from './List';
import Skeleton from './Skeleton';
import { FC } from 'react';

const UsersContent: FC = () => {
  const { list, take, count, page, isEmptyList, isListProcessing, onPageChange } = useList<UserObj>(
    {
      initialList: new UserList(),
      apiName: Apis.USERS,
      config: {
        baseURL: process.env.USER_SERVICE,
      },
    }
  );

  return (
    <ListContainer>
      {isListProcessing() ? (
        <Skeleton take={take} />
      ) : isEmptyList ? (
        <EmptyList />
      ) : (
        <List list={list} count={count} take={take} page={page} onPageChange={onPageChange} />
      )}
    </ListContainer>
  );
};

export default UsersContent;
