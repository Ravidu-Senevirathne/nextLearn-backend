import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ExamQuestion } from './exam-question.entity';

@Entity()
export class ExamQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne(() => ExamQuestion, (question) => question.options, { onDelete: 'CASCADE' })
  question: ExamQuestion;
}