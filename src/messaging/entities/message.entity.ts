import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

export type MessageStatus = 'sent' | 'delivered' | 'read';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    senderId: number;

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: 'sent' })
    status: MessageStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
