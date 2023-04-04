import { FC, PropsWithChildren, Fragment, useEffect } from 'react';
import { userServiceSocket } from '../lib';
import { notification } from 'antd';

const UserServiceSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    userServiceSocket.on('connect_error', err => {
      // notification.error({ message: 'Error', description: err.message });
    });
    return () => {
      userServiceSocket.removeAllListeners();
    };
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default UserServiceSocketProvider;
