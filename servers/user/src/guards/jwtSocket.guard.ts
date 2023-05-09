import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { CustomSocket } from 'src/adapters';

@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const webSocket = context.switchToWs();
    const socket: CustomSocket = webSocket.getClient();
    const bearerToken = socket.handshake.headers.authorization;

    if (bearerToken) {
      const [_, token] = bearerToken.split(' ');
      return this.jwtService
        .verifyAsync(token)
        .then((user) => {
          socket.user = user;
          return true;
        })
        .catch((reason) => false);
    }

    return false;
  }
}
