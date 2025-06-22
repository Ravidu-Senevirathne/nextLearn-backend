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
}
