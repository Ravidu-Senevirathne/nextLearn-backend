import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { ConversationParticipant } from '../entities/conversation-participant.entity';
import { User } from '../../user/entities/user.entity';
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,
        @InjectRepository(ConversationParticipant)
        private participantRepo: Repository<ConversationParticipant>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async getConversationMessages(
        conversationId: string,
        userId: number,
        page = 1,
        limit = 20,
    ) {
        // Verify user is a participant
        await this.verifyParticipant(conversationId, userId);

        const [messages, total] = await this.messageRepo.findAndCount({
            where: { conversation: { id: conversationId } },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: messages.reverse(), // Return oldest first for UI
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async sendMessage(
        userId: number,
        conversationId: string,
        dto: SendMessageDto,
    ) {
        // Verify user is a participant
        await this.verifyParticipant(conversationId, userId);

        const message = this.messageRepo.create({
            sender: { id: userId },
            conversation: { id: conversationId },
            content: dto.content,
            status: 'sent',
        });

        const savedMessage = await this.messageRepo.save(message);

        // Update conversation last message timestamp
        await this.conversationRepo.update(conversationId, {
            updatedAt: new Date(),
        });

        // Increment unread count for other participants
        await this.participantRepo
            .createQueryBuilder()
            .update()
            .set({ unreadCount: () => 'unreadCount + 1' })
            .where('conversationId = :conversationId AND userId != :userId', {
                conversationId,
                userId,
            })
            .execute();

        return savedMessage;
    }

    async updateUserStatus(userId: number, isOnline: boolean) {
        await this.userRepo.update(
            { id: userId },
            {
                isOnline,
                lastSeen: isOnline ? null : new Date()
            }
        );
        return { success: true };
    }

    private async verifyParticipant(conversationId: string, userId: number) {
        const participant = await this.participantRepo.findOne({
            where: {
                conversation: { id: conversationId },
                user: { id: userId },
            },
        });

        if (!participant) {
            throw new ForbiddenException('You are not a participant in this conversation');
        }

        return participant;
    }
}
