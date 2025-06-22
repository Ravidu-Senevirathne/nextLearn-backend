import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Course } from '../../Lecturer/courses/entities/course.entity';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ default: false })
    isGroup: boolean;

    @Column({ nullable: true })
    avatarUrl: string;

    @ManyToOne(() => Course, { nullable: true })
    course: Course;

    @Column({ nullable: true })
    courseId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ConversationParticipant, participant => participant.conversation, { cascade: true })
    participants: ConversationParticipant[];

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];
}
