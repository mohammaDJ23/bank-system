import ListContainer from '../../layout/ListContainer';
import { Pathes, UserList, UserListFilters, UserObj } from '../../lib';
import EmptyList from './EmptyList';
import List from './List';
import Skeleton from './Skeleton';
import { FC, useCallback, useEffect } from 'react';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';
import { Navigate, useLocation } from 'react-router-dom';

const UsersContent: FC = () => {
  const location = useLocation();
  const userListFiltersInstance = useForm(UserListFilters);
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const userListInstance = usePaginationList(UserList);
  const userListInfo = userListInstance.getFullInfo();
  const isInitialUsersApiProcessing = isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = isApiProcessing(UsersApi);
  const previousUserId: string | undefined = location.state?.previousUserId;
  const isPreviousUserExist = !!previousUserId;

  const getUsersList = useCallback(
    (options: Partial<UsersApiConstructorType> = {}) => {
      const userFilters = userListFiltersInstance.getForm();
      const apiData = Object.assign({ take: userListInfo.take, page: userListInfo.page, ...options }, userFilters);
      const userApi = new UsersApi<UserObj>(apiData);

      if (apiData.isInitialApi) {
        userApi.setInitialApi();
      }

      request<[UserObj[], number], UsersApiConstructorType>(userApi).then(response => {
        const [list, total] = response.data;
        userListInstance.insertNewList({ total, list, page: apiData.page });
      });
    },
    [userListInfo, userListInstance, userListFiltersInstance, request]
  );

  useEffect(() => {
    if (isPreviousUserExist) return;
    getUsersList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      userListInstance.onPageChange(newPage);

      if (userListInstance.isNewPageEqualToCurrentPage(newPage) || isUsersApiProcessing) return;

      if (!userListInstance.isNewPageExist(newPage)) getUsersList({ page: newPage });
    },
    [userListInstance, isUsersApiProcessing, getUsersList]
  );

  if (isPreviousUserExist) {
    return <Navigate to={Pathes.USER.replace(':id', previousUserId)} />;
  }

  return (
    <ListContainer>
      {isInitialUsersApiProcessing || isUsersApiProcessing ? (
        <Skeleton take={userListInfo.take} />
      ) : userListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <List listInstance={userListInstance} onPageChange={changePage} />
      )}
    </ListContainer>
  );
};

export default UsersContent;
