import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { isUserAuthenticated, Pathes } from '../../lib';

const NotFound: FC = () => {
  return <Navigate to={isUserAuthenticated() ? Pathes.DASHBOARD : Pathes.UNAUTHORIZED} />;
};

export default NotFound;
