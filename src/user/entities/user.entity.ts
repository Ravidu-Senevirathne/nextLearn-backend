import { Course } from 'src/Lecturer/courses/entities/course.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    LECTURER = 'lecturer',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    mobile: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
    role: UserRole;

    @OneToMany(() => Course, (course) => course.lecturer)
    courses: Course[];
}
