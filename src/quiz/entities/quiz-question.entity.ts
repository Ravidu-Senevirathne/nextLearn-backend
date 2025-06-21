import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class QuizQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column({
        type: 'enum',
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay']
    })
    type: string;

    @Column({ type: 'json', nullable: true })
    options: string[]; // For multiple choice

    @Column({ type: 'json', nullable: true })
    correctAnswer: string | string[]; // Can be string, array of strings, or boolean

    @Column({ type: 'int', default: 1 })
    points: number;

    @Column({ type: 'int' })
    order: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
    quiz: Quiz;
}