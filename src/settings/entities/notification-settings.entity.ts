import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class NotificationSettings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    courseUpdates: boolean;

    @Column({ default: true })
    studentMessages: boolean;

    @Column({ default: true })
    studentSubmissions: boolean;

    @Column({ default: false })
    platformAnnouncements: boolean;

    @Column({ default: false })
    marketingEmails: boolean;

    @OneToOne(() => User, (user) => user.notificationSettings, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
