import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Request,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './services/messages.service';
import { ConversationsService } from './services/conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly conversationsService: ConversationsService,
    ) { }

    @Get('conversations')
    async getUserConversations(@Request() req) {
        const userId = req.user.id;
        return this.conversationsService.getUserConversations(userId);
    }

    @Get('conversations/:id')
    async getConversation(@Param('id') conversationId: string, @Request() req) {
        const userId = req.user.id;
        return this.conversationsService.getConversation(conversationId, userId);
    }

    @Get('conversations/:id/messages')
    async getConversationMessages(
        @Param('id') conversationId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 20,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.messagesService.getConversationMessages(
            conversationId,
            userId,
            page,
            limit,
        );
    }

    @Post('conversations')
    async createConversation(
        @Body() createConversationDto: CreateConversationDto,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.conversationsService.createConversation(
            userId,
            createConversationDto,
        );
    }

    @Post('conversations/:id/messages')
    async sendMessage(
        @Param('id') conversationId: string,
        @Body() sendMessageDto: SendMessageDto,
        @Request() req,
    ) {
        const userId = req.user.id;
        return this.messagesService.sendMessage(
            userId,
            conversationId,
            sendMessageDto,
        );
    }

    @Patch('conversations/:id/read')
    async markAsRead(@Param('id') conversationId: string, @Request() req) {
        const userId = req.user.id;
        return this.conversationsService.markAsRead(conversationId, userId);
    }

    @Delete('conversations/:id')
    async deleteConversation(@Param('id') conversationId: string, @Request() req) {
        const userId = req.user.id;
        return this.conversationsService.deleteConversation(conversationId, userId);
    }
}
