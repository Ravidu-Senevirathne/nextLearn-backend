import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './services/messages.service';
import { ConversationsService } from './services/conversations.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MessagesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private jwtService: JwtService,
        private messagesService: MessagesService,
        private conversationsService: ConversationsService,
    ) { }

    afterInit(server: Server) {
        console.log('WebSocket Gateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;

            // Update user online status
            await this.messagesService.updateUserStatus(payload.sub, true);

            // Join user to their conversation rooms
            const conversations = await this.conversationsService.getUserConversations(payload.sub);
            conversations.forEach((conv) => {
                client.join(`conversation_${conv.id}`);
            });

            console.log(`Client connected: ${client.id} (User ID: ${payload.sub})`);
        } catch (error) {
            client.disconnect();
            console.log('Client disconnected due to authentication error');
        }
    }

    async handleDisconnect(client: Socket) {
        if (client.data.userId) {
            // Update user offline status
            await this.messagesService.updateUserStatus(client.data.userId, false);
            console.log(`Client disconnected: ${client.id} (User ID: ${client.data.userId})`);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        client: Socket,
        payload: { conversationId: string; content: string },
    ) {
        const message = await this.messagesService.sendMessage(
            client.data.userId,
            payload.conversationId,
            { content: payload.content },
        );

        // Broadcast to all conversation participants
        this.server.to(`conversation_${payload.conversationId}`).emit('newMessage', {
            conversationId: payload.conversationId,
            message,
        });

        return { success: true };
    }

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(client: Socket, payload: { conversationId: string }) {
        await this.conversationsService.markAsRead(
            payload.conversationId,
            client.data.userId,
        );

        // Notify other participants that messages were read
        this.server.to(`conversation_${payload.conversationId}`).emit('messagesRead', {
            conversationId: payload.conversationId,
            userId: client.data.userId,
        });
    }
}
