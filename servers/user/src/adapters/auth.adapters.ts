import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket, Server } from 'socket.io';
import { User } from 'src/entities';

export interface CustomSocket extends Socket {
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'> & {
    expiration: number;
    iat: number;
    exp: number;
  };
}

export class AuthAdapter extends IoAdapter {
  private jwtService: JwtService;

  constructor(app: INestApplication) {
    super(app);
    app.resolve(JwtService).then((jwtService) => {
      this.jwtService = jwtService;
    });
  }

  createIOServer(port: number, options?: any): Server {
    const server: Server = super.createIOServer(port, options);
    const unAuthorizedError = new UnauthorizedException(
      'No token is provided for socket.',
    );

    server.use((socket: CustomSocket, next) => {
      const bearerToken = socket.handshake.headers.authorization;

      if (bearerToken) {
        const [_, token] = bearerToken.split(' ');
        this.jwtService
          .verifyAsync(token)
          .then((user) => {
            socket.user = user;
            next();
          })
          .catch((reason) => next(unAuthorizedError));
      } else next(unAuthorizedError);
    });

    return server;
  }
}
