import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    duration: number; // in minutes

    @Column({ type: 'enum', enum: ['video', 'document'] })
    contentType: string;

    @Column({ nullable: true })
    contentUrl: string;

    @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
    status: string;

    @ManyToOne(() => Course, (course) => course.lessons)
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @Column()
    courseId: string;
}