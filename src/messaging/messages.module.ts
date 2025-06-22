import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Course } from '../Lecturer/courses/entities/course.entity';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './services/messages.service';
import { ConversationsService } from './services/conversations.service';
import { MessagesGateway } from './messages.gateway';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Conversation,
            ConversationParticipant,
            Message,
            Course,
        ]),
    ],
    controllers: [MessagesController],
    providers: [
        MessagesService,
        ConversationsService,
        MessagesGateway,
        JwtService
    ],
    exports: [MessagesService, ConversationsService],
})
export class MessagesModule { }
