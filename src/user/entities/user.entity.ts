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
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Grade } from 'src/Lecturer/grades/entities/grade.entity';
import { Progress } from 'src/Lecturer/progress/entities/progress.entity';
import { Message } from 'src/messaging/entities/message.entity';
import { ConversationParticipant } from 'src/messaging/entities/conversation-participant.entity';
import { Education } from 'src/lecturer-profile/entities/education.entity';
import { SocialMedia } from 'src/lecturer-profile/entities/social-media.entity';
import { NotificationSettings } from 'src/settings/entities/notification-settings.entity';
import { ConnectedAccounts } from 'src/settings/entities/connected-accounts.entity';
import { Session } from 'src/settings/entities/session.entity';

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

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  officeHours: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column({ type: 'simple-array', nullable: true })
  expertise: string[];

  @Column({ default: 'public', nullable: true })
  profileVisibility: string;

  @Column({ default: 'en', nullable: true })
  language: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Education, (education) => education.user)
  education: Education[];

  @OneToMany(() => SocialMedia, (social) => social.user)
  socialMedia: SocialMedia[];

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

  @OneToOne(() => NotificationSettings, (settings) => settings.user, { cascade: true })
  notificationSettings: NotificationSettings;

  @OneToOne(() => ConnectedAccounts, (accounts) => accounts.user, { cascade: true })
  connectedAccounts: ConnectedAccounts;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
