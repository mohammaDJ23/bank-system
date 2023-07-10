import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { UserService } from 'src/services';
import { JwtSocketGuard } from 'src/guards';
import { CustomSocket } from 'src/adapters';

@WebSocketGateway({
  path: '/socket/user-connection',
  cors: { origin: process.env.CLIENT_CONTAINER_URL },
})
export class UserConnectionGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private wss: Server;

  constructor(private readonly userService: UserService) {}

  handleConnection(client: CustomSocket) {
    console.log('user connected');
  }

  handleDisconnect(client: CustomSocket) {
    console.log('user disconnected');
  }
}
