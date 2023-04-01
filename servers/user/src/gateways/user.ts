import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'src/services/user.service';

@WebSocketGateway({ path: '/socket/user-connection' })
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
