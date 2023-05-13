import ListContainer from '../../layout/ListContainer';
import { getDynamicPath, Pathes, UserList } from '../../lib';
import List from './List';
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { useAction, usePaginationList, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UsersApi } from '../../apis';

const UsersContent: FC = () => {
  const { showModal } = useAction();
  const location = useLocation();
  const { isInitialApiProcessing } = useRequest();
  const userListInstance = usePaginationList(UserList);
  const isInitialUsersApiProcessing = isInitialApiProcessing(UsersApi);
  const usersTotal = userListInstance.getTotal();
  const previousUserId: string | undefined = location.state?.previousUserId;
  const isPreviousUserIdExist = !!previousUserId;

  if (isPreviousUserIdExist) {
    return <Navigate to={getDynamicPath(Pathes.USER, { id: previousUserId })} />;
  }

  const menuOptions = [<Typography onClick={() => showModal(ModalNames.USER_FILTERS)}>Filters</Typography>];

  return (
    <Navigation title={`Users ${!isInitialUsersApiProcessing ? `(${usersTotal})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default UsersContent;
