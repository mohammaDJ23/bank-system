import { io } from 'socket.io-client';
import { getToken } from './authentication';

export const userServiceSocket = io(`${process.env.USER_SERVICE}`, {
  path: '/socket/user-connection',
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  },
});
