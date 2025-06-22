import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ConversationParticipant } from '../entities/conversation-participant.entity';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../Lecturer/courses/entities/course.entity';
import { Message } from '../entities/message.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,
        @InjectRepository(ConversationParticipant)
        private participantRepo: Repository<ConversationParticipant>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Course)
        private courseRepo: Repository<Course>,
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
    ) { }

    async getUserConversations(userId: number) {
        const participants = await this.participantRepo.find({
            where: { user: { id: userId } },
            relations: [
                'conversation',
                'conversation.participants',
                'conversation.participants.user',
                'conversation.course',
            ],
            order: { conversation: { updatedAt: 'DESC' } },
        });

        // Get last message for each conversation
        const conversationsWithLastMessage = await Promise.all(
            participants.map(async (participant) => {
                const conv = participant.conversation;
                const otherParticipants = conv.participants.filter(
                    (p) => p.user.id !== userId,
                );

                // Get last message
                const lastMessage = await this.messageRepo.findOne({
                    where: { conversation: { id: conv.id } },
                    relations: ['sender'],
                    order: { createdAt: 'DESC' },
                });

                return {
                    id: conv.id,
                    name: conv.isGroup
                        ? conv.name
                        : otherParticipants[0]?.user.firstName + ' ' + otherParticipants[0]?.user.lastName,
                    avatarUrl: conv.isGroup ? conv.avatarUrl : otherParticipants[0]?.user.avatarUrl,
                    isGroup: conv.isGroup,
                    participants: conv.participants.map((p) => ({
                        id: p.user.id,
                        name: `${p.user.firstName || ''} ${p.user.lastName || ''}`,
                        avatarUrl: p.user.avatarUrl,
                        isOnline: p.user.isOnline,
                        lastSeen: p.user.lastSeen,
                    })),
                    lastMessage: lastMessage
                        ? {
                            content: lastMessage.content,
                            timestamp: lastMessage.createdAt,
                            senderId: lastMessage.sender.id,
                        }
                        : null,
                    unreadCount: participant.unreadCount,
                    course: conv.course,
                    updatedAt: conv.updatedAt,
                };
            })
        );

        return conversationsWithLastMessage;
    }

    async getConversation(conversationId: string, userId: number) {
        const participant = await this.participantRepo.findOne({
            where: {
                conversation: { id: conversationId },
                user: { id: userId },
            },
            relations: [
                'conversation',
                'conversation.participants',
                'conversation.participants.user',
                'conversation.course',
            ],
        });

        if (!participant) {
            throw new NotFoundException('Conversation not found');
        }

        const conv = participant.conversation;
        const otherParticipants = conv.participants.filter(
            (p) => p.user.id !== userId,
        );

        return {
            id: conv.id,
            name: conv.isGroup
                ? conv.name
                : otherParticipants[0]?.user.firstName + ' ' + otherParticipants[0]?.user.lastName,
            avatarUrl: conv.isGroup ? conv.avatarUrl : otherParticipants[0]?.user.avatarUrl,
            isGroup: conv.isGroup,
            participants: conv.participants.map((p) => ({
                id: p.user.id,
                name: `${p.user.firstName || ''} ${p.user.lastName || ''}`,
                avatarUrl: p.user.avatarUrl,
                isOnline: p.user.isOnline,
                lastSeen: p.user.lastSeen,
            })),
            course: conv.course,
            createdAt: conv.createdAt,
        };
    }

    async createConversation(userId: number, dto: CreateConversationDto) {
        // Check if it's a direct message and conversation already exists
        if (!dto.isGroup && dto.participantIds.length === 1) {
            const existingConv = await this.participantRepo
                .createQueryBuilder('participant')
                .innerJoinAndSelect('participant.conversation', 'conv')
                .where('participant.userId = :userId', { userId })
                .andWhere('conv.isGroup = false')
                .getMany();

            for (const participant of existingConv) {
                const otherParticipant = await this.participantRepo.findOne({
                    where: {
                        conversation: { id: participant.conversationId },
                        userId: dto.participantIds[0]
                    }
                });

                if (otherParticipant) {
                    return this.getConversation(participant.conversationId, userId);
                }
            }
        }

        // Create new conversation - fix the creation approach
        const conversation = new Conversation();
       conversation.name = dto.isGroup ? (dto.name || dto.groupName || '') : '';
        conversation.avatarUrl = dto.avatarUrl || '';

        conversation.isGroup = dto.isGroup;
        
        
        if (dto.courseId) {
            conversation.course = { id: dto.courseId } as Course;
        }

        const savedConversation = await this.conversationRepo.save(conversation);
        const conversationId = savedConversation.id;

        // Add participants
        const participants = [
            { user: { id: userId }, conversation: { id: conversationId } },
            ...dto.participantIds.map((id) => ({
                user: { id },
                conversation: { id: conversationId },
            })),
        ];

        await this.participantRepo.save(participants);

        return this.getConversation(conversationId, userId);
    }

    async markAsRead(conversationId: string, userId: number) {
        await this.participantRepo.update(
            { conversation: { id: conversationId }, user: { id: userId } },
            { unreadCount: 0 },
        );

        // Update message statuses to 'read'
        await this.messageRepo
            .createQueryBuilder()
            .update()
            .set({ status: 'read' })
            .where('conversationId = :conversationId AND senderId != :userId', {
                conversationId,
                userId,
            })
            .execute();

        return { success: true };
    }

    async deleteConversation(conversationId: string, userId: number) {
        // Verify user is a participant
        const participant = await this.participantRepo.findOne({
            where: {
                conversation: { id: conversationId },
                user: { id: userId },
            },
        });

        if (!participant) {
            throw new ForbiddenException('You are not a participant in this conversation');
        }

        // For group chats, just remove the participant
        // For direct messages, delete the conversation
        const conversation = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: ['participants'],
        });

        if (conversation && conversation.isGroup) {
            await this.participantRepo.delete({
                conversation: { id: conversationId },
                user: { id: userId },
            });
        } else if (conversation) {
            await this.conversationRepo.delete(conversationId);
        }

        return { success: true };
    }
}
