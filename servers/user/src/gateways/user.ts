import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { UserService } from 'src/services/user.service';
import { JwtSocketAuthGuard } from 'src/guards/jwt-socket-auth.guard';

@WebSocketGateway({ path: '/socket/user-connection', cors: { origin: '*' } })
export class UserConnectionGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private wss: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('user connected');
  }

  handleDisconnect(client: any) {
    console.log('user disconnected');
  }
}
