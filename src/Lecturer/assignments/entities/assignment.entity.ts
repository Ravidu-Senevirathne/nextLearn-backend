import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Grade } from 'src/Lecturer/grades/entities/grade.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'int', nullable: true })
  totalPoints: number;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[]; // Array of file paths or URLs

  @ManyToOne(() => Course, (course) => course.assignments)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @OneToMany(() => Grade, (grade) => grade.assignment)
  grades: Grade[];

  @Column()
  courseId: string;
}