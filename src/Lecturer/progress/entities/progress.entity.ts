import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class Progress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    courseId: string;

    @Column({ nullable: true })
    lessonId: string;

    @Column({ type: 'int', default: 0 })
    percentage: number;

    @Column({ type: 'int', default: 0 })
    timeSpentMinutes: number;

    @ManyToOne(() => User, user => user.progress)
    user: User;

    @ManyToOne(() => Course, course => course.progress)
    course: Course;

    @ManyToOne(() => Lesson, lesson => lesson.progress, { nullable: true })
    lesson: Lesson;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
