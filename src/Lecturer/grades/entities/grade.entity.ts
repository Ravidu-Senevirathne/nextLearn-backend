import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Assignment } from 'src/Lecturer/assignments/entities/assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/Lecturer/courses/entities/course.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Assignment, (assignment) => assignment.grades)
  assignment: Assignment;

  @ManyToOne(() => User, (user) => user.grades)
  student: User;

  @ManyToOne(() => Course, (course) => course.grades)
  course: Course;
}