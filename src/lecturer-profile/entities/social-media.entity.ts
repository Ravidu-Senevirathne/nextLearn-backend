import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class SocialMedia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    twitter: string;

    @Column({ nullable: true })
    linkedin: string;

    @Column({ nullable: true })
    github: string;

    @ManyToOne(() => User, (user) => user.socialMedia)
    user: User;
}
