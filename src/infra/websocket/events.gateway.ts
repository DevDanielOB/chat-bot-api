import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(EventsGateway.name);

  private connectedUsers = new Map<number, string>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (!userId) {
      client.disconnect();
      return;
    }

    this.connectedUsers.set(userId, client.id);
    this.logger.log(`Usuário ${userId} conectado [socket: ${client.id}]`);
  }

  handleDisconnect(client: Socket) {
    const entry = [...this.connectedUsers.entries()]
      .find(([_, socketId]) => socketId === client.id);

    if (entry) {
      const [userId] = entry;
      this.connectedUsers.delete(userId);
      this.logger.log(`Usuário ${userId} desconectado`);
    }
  }

  sendMessageToUser(userId: number, message: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new-message', message);
    } else {
      this.logger.warn(`Usuário ${userId} não está conectado para receber mensagens`);
    }
  }
}