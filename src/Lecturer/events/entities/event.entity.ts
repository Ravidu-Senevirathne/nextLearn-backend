import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../../user/entities/user.entity';

export enum EventType {
  LESSON = 'lesson',
  QUIZ = 'quiz',
  DEADLINE = 'deadline',
  MEETING = 'meeting',
  LIVE = 'live',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.LESSON,
  })
  type: EventType;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Course, (course) => course.events, { nullable: true })
  course: Course;

  @ManyToOne(() => User, (user) => user.events)
  creator: User;
}
