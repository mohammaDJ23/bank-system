import ListContainer from '../../layout/ListContainer';
import { Constructor, UserList, UserObj } from '../../lib';
import EmptyList from '../EmptyList';
import List from './List';
import Skeleton from './Skeleton';
import { FC, useCallback, useEffect } from 'react';
import { usePaginationList, useRequest } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';

const UsersContent: FC = () => {
  const { request, isInitialApiProcessing } = useRequest();
  const listMaker = usePaginationList();
  const { setList, onPageChange, getFullInfo, getListInfo } = listMaker(UserList);
  const { list, isListEmpty, count, page, take, lists } = getFullInfo();
  const isLoading = isInitialApiProcessing(UsersApi);

  const getUsersList = useCallback(
    (options: Partial<UsersApiConstructorType> = {}) => {
      const apiData = { take, page, ...options };
      request<[UserObj[], number], UsersApiConstructorType>(new UsersApi<UserObj>(apiData)).then(
        res => {
          const [userList, total] = res.data;
          const createdList = getListInfo();
          const constructedUserList = new (createdList.constructor as Constructor<UserList>)();
          constructedUserList.list = Object.assign(lists, { [apiData.page]: userList });
          constructedUserList.total = total;
          constructedUserList.page = page;
          setList(constructedUserList);
        }
      );
    },
    [take, page, lists, request, setList, getListInfo]
  );

  useEffect(() => {
    getUsersList();
    return () => setList(new UserList());
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      if (newPage === page || isLoading) return;

      onPageChange(newPage);

      if (!list[newPage]) {
        getUsersList({ page: newPage });
      }
    },
    [page, isLoading, list, getUsersList, onPageChange]
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
