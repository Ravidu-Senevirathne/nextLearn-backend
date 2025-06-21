import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { QuizQuestion } from './quiz-question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // in minutes

  @Column({ type: 'int', default: 70 })
  passingScore: number;

  @Column({ default: false })
  shuffleQuestions: boolean;

  @Column({ default: false })
  showCorrectAnswers: boolean;

  @Column({ type: 'int', default: 1 })
  maxAttempts: number;

  @ManyToOne(() => Course, (course) => course.quizzes)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @OneToMany(() => QuizQuestion, (question) => question.quiz, { cascade: true })
  questions: QuizQuestion[];
}