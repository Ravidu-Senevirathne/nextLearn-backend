import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ExamQuestion } from './exam-question.entity';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    instructions: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'int' })
    duration: number; // in minutes

    @Column({ type: 'int' })
    passingPercentage: number;

    @Column({ default: false })
    shuffleQuestions: boolean;

    @Column({ default: false })
    showResults: boolean;

    @Column({
        type: 'enum',
        enum: ['draft', 'published'],
        default: 'draft'
    })
    status: string;

    @ManyToOne(() => Course, (course) => course.exams)
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @Column()
    courseId: string;

    @OneToMany(() => ExamQuestion, (question) => question.exam, { cascade: true })
    questions: ExamQuestion[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}