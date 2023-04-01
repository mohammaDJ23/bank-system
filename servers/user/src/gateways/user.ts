import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'src/services/user.service';

@WebSocketGateway({ namespace: 'user/connections' })
export class UserConnectionGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private wss: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log('user connected', client);
  }

  handleDisconnect(client: any) {
    console.log('user disconnected', client);
  }
}
