import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { ExamQuestionOption } from './exam-question-option.entity';

@Entity()
export class ExamQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column({
        type: 'enum',
        enum: ['multiple_choice', 'true_false', 'short_answer', 'essay']
    })
    type: string;

    @Column({ type: 'int' })
    marks: number;

    @Column({ type: 'int' })
    order: number;

    @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
    exam: Exam;

    @OneToMany(() => ExamQuestionOption, (option) => option.question, { cascade: true })
    options: ExamQuestionOption[];
}