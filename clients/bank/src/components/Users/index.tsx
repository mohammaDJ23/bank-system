import ListContainer from '../../layout/ListContainer';
import { getDynamicPath, Pathes } from '../../lib';
import List from './List';
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const UsersContent: FC = () => {
  const location = useLocation();
  const previousUserId: string | undefined = location.state?.previousUserId;
  const isPreviousUserIdExist = !!previousUserId;

  if (isPreviousUserIdExist) {
    return <Navigate to={getDynamicPath(Pathes.USER, { id: previousUserId })} />;
  }

  return (
    <ListContainer>
      <List />
    </ListContainer>
  );
};

export default UsersContent;
