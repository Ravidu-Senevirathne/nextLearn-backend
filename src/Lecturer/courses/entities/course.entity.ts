import { Assignment } from 'src/Lecturer/assignments/entities/assignment.entity';
import { Exam } from 'src/Lecturer/exam/entities/exam.entity';
import { Group } from 'src/Lecturer/groups/entities/group.entity';
import { Lesson } from 'src/Lecturer/lessons/entities/lesson.entity';
import { Quiz } from 'src/Lecturer/quiz/entities/quiz.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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


  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];

    @OneToMany(() => Group, (group) => group.course)
  groups: Group[];

  @CreateDateColumn()
  createdAt: Date;
}
