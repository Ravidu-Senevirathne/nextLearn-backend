import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quiz.service';
import { QuizzesController } from './quiz.controller';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizQuestion, Course]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
})
export class QuizModule { }
