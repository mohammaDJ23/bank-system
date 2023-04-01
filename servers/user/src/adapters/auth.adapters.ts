import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket, Server } from 'socket.io';

export interface CustomSocket extends Socket {
  user: {};
}

export class AuthAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): Server {
    const server: Server = super.createIOServer(
      port,
      Object.assign(options, { cors: true }),
    );

    server.use((socket: CustomSocket, next) => {
      if (socket.handshake.headers.authorization) {
        socket.user = {};
        next();
      }
    });

    return server;
  }
}
