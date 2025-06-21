import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Assignment } from 'src/assignments/entities/assignment.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  level: string;

  @Column()
  duration: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('simple-array')
  topics: string[];

  @Column('simple-array')
  features: string[];

  @Column('simple-array')
  requirements: string[];

  @ManyToOne(() => User, (user) => user.courses)
  lecturer: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignments: Assignment[];

   @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;
}
