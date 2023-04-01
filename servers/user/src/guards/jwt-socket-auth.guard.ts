import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class JwtSocketAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const webSocket = context.switchToWs();
    const socket: Socket = webSocket.getClient();
    const bearerToken = socket.handshake.headers.authorization;

    if (bearerToken) {
      const [_, token] = bearerToken.split(' ');
      console.log(token);
    } else return false;
  }
}
