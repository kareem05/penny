// apps/api/src/app/websocket/websocket.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:4200'
    }
  })
  export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;
  
    constructor(private jwtService: JwtService) {}
  
    async handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
      client.join(room);
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
      client.leave(room);
    }
  
    // Method to emit updates to connected clients
    emitUpdate(event: string, data: any, room?: string) {
      if (room) {
        this.server.to(room).emit(event, data);
      } else {
        this.server.emit(event, data);
      }
    }
  }
