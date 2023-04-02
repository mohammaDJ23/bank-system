import ListContainer from '../../layout/ListContainer';
import { Constructor, Pathes, UserList, UserObj } from '../../lib';
import EmptyList from './EmptyList';
import List from './List';
import Skeleton from './Skeleton';
import { FC, useCallback, useEffect } from 'react';
import { usePaginationList, useRequest } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';
import { Navigate, useLocation } from 'react-router-dom';

const UsersContent: FC = () => {
  const location = useLocation();
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { setList, onPageChange, getFullInfo, getListInfo } = usePaginationList(UserList);
  const { list, isListEmpty, count, page, take, lists } = getFullInfo();
  const isInitialUsersApiProcessing = isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = isApiProcessing(UsersApi);
  const previousUserId: string | undefined = location.state?.previousUserId;
  const isPreviousUserExist = !!previousUserId;

  const getUsersList = useCallback(
    (options: Partial<UsersApiConstructorType> = {}) => {
      const apiData = { take, page, ...options };
      const userApi = new UsersApi<UserObj>(apiData);

      if (apiData.isInitialApi) {
        userApi.setInitialApi();
      }

      request<[UserObj[], number], UsersApiConstructorType>(userApi).then(response => {
        const [userList, total] = response.data;
        const createdList = getListInfo();
        const constructedUserList = new (createdList.constructor as Constructor<UserList>)();
        constructedUserList.list = Object.assign(lists, { [apiData.page]: userList });
        constructedUserList.total = total;
        constructedUserList.page = apiData.page;
        setList(constructedUserList);
      });
    },
    [take, page, lists, request, setList, getListInfo]
  );

  useEffect(() => {
    if (isPreviousUserExist) return;
    getUsersList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      onPageChange(newPage);

      if (newPage === page || isUsersApiProcessing) return;

      if (!lists[newPage]) {
        getUsersList({ page: newPage });
      }
    },
    [page, isUsersApiProcessing, lists, getUsersList, onPageChange]
  );

  if (isPreviousUserExist) {
    return <Navigate to={Pathes.USER.replace(':id', previousUserId)} />;
  }

  return (
    <ListContainer>
      {isInitialUsersApiProcessing || isUsersApiProcessing ? (
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
