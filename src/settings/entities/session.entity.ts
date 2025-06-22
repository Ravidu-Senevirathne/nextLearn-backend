import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    userAgent: string;

    @Column()
    ipAddress: string;

    @Column({ nullable: true })
    location: string;

    @Column({ default: false })
    isCurrent: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
    user: User;
}
