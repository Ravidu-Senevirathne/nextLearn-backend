import { Course } from 'src/Lecturer/courses/entities/course.entity';
import { Enrollment } from 'src/Lecturer/enrollments/entities/enrollment.entity';
import { Group } from 'src/Lecturer/groups/entities/group.entity';
import { Event } from 'src/Lecturer/events/entities/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Grade } from 'src/Lecturer/grades/entities/grade.entity';
import { Progress } from 'src/Lecturer/progress/entities/progress.entity';
import { Message } from 'src/messaging/entities/message.entity';
import { ConversationParticipant } from 'src/messaging/entities/conversation-participant.entity';

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

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastSeen: Date | null;

  @OneToMany(() => Course, (course) => course.lecturer)
  courses: Course[];

  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];

  @OneToMany(() => Progress, (progress) => progress.user)
  progress: Progress[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => ConversationParticipant, (participant) => participant.user)
  conversations: ConversationParticipant[];
}
