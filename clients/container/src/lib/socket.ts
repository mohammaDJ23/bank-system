import { io } from 'socket.io-client';
import { getToken } from './authentication';

export const userServiceSocket = io(`${process.env.USER_SERVICE}/user/connections`, { query: { token: getToken() } });
