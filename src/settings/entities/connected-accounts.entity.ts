import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ConnectedAccounts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    google: boolean;

    @Column({ default: false })
    github: boolean;

    @Column({ default: false })
    linkedin: boolean;

    @OneToOne(() => User, (user) => user.connectedAccounts, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}
