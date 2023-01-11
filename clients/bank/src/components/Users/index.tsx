import ListContainer from '../../layout/ListContainer';
import { UserList, UserObj } from '../../lib';
import EmptyList from '../EmptyList';
import List from './List';
import Skeleton from './Skeleton';
import { FC, useCallback, useEffect } from 'react';
import { usePaginationList, useRequest } from '../../hooks';
import { UsersApi } from '../../apis';

const UsersContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const listMaker = usePaginationList();
  const { setList, onPageChange, getFullInfo } = listMaker(UserList);
  const { list, isListEmpty, count, page, take } = getFullInfo();
  const isLoading = isInitialApiProcessing(UsersApi);

  const getUsersList = useCallback(() => {
    request<[UserObj[], number]>(new UsersApi<UserObj>({ take, page })).then(res => {
      const [userList, total] = res.data;
      const constructedUserList = new UserList();
      constructedUserList.list[constructedUserList.page] = userList;
      constructedUserList.total = total;
      setList(constructedUserList);
    });
  }, [take, page, request, setList]);

  useEffect(() => {
    getUsersList();
    return () => setList(new UserList());
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      if (newPage === page || isLoading) return;
      onPageChange(newPage);
      getUsersList();
    },
    [page, isLoading, getUsersList, onPageChange]
  );

  return (
    <ListContainer>
      {isLoading ? (
        <Skeleton take={take} />
      ) : isListEmpty ? (
        <EmptyList />
      ) : (
        <List list={list} count={count} take={take} page={page} onPageChange={changePage} />
      )}
    </ListContainer>
  );
};

export default UsersContent;
