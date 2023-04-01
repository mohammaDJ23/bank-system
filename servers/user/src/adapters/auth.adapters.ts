import { UnauthorizedException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket, Server } from 'socket.io';

export interface CustomSocket extends Socket {
  user: {};
}

export class AuthAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): Server {
    const server: Server = super.createIOServer(port, options);

    server.use((socket: CustomSocket, next) => {
      const bearerToken = socket.handshake.headers.authorization;

      if (bearerToken) {
        const [_, token] = bearerToken.split(' ');
        console.log(token);
        socket.user = {};
        next();
      } else
        next(new UnauthorizedException('No token is provided for socket.'));
    });

    return server;
  }
}
