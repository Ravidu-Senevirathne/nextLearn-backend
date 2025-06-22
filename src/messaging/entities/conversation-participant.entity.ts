import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class ConversationParticipant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.conversations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Conversation, conversation => conversation.participants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: string;

    @Column({ default: 0 })
    unreadCount: number;

    @Column({ default: false })
    isMuted: boolean;

    @CreateDateColumn()
    joinedAt: Date;
}
