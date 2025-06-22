import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    degree: string;

    @Column()
    institution: string;

    @Column()
    year: string;

    @ManyToOne(() => User, (user) => user.education)
    user: User;
}
