import { FC, PropsWithChildren, Fragment } from 'react';
import { userServiceSocket } from '../lib';

const UserServiceSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketProvider;
