import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Course } from '../courses/entities/course.entity';
import { QuizQuestion } from './entities/quiz-question.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(QuizQuestion)
    private questionsRepository: Repository<QuizQuestion>,
  ) { }

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const course = await this.coursesRepository.findOne({
      where: { id: createQuizDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const quiz = this.quizzesRepository.create({
      ...createQuizDto,
      course,
    });

    const savedQuiz = await this.quizzesRepository.save(quiz);

    // Save questions
    if (createQuizDto.questions && createQuizDto.questions.length > 0) {
      const questions = createQuizDto.questions.map((q) =>
        this.questionsRepository.create({
          ...q,
          quiz: savedQuiz,
        }),
      );
      await this.questionsRepository.save(questions);
    }

    return this.findOne(savedQuiz.id);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.find({ relations: ['course', 'questions'] });
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
      relations: ['course', 'questions'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);

    if (updateQuizDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateQuizDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      quiz.course = course;
    }

    Object.assign(quiz, updateQuizDto);

    // Update questions if provided
    if (updateQuizDto.questions) {
      await this.questionsRepository.delete({ quiz: { id } });

      const questions = updateQuizDto.questions.map((q) =>
        this.questionsRepository.create({
          ...q,
          quiz: { id },
        }),
      );
      await this.questionsRepository.save(questions);
    }

    await this.quizzesRepository.save(quiz);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizzesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Quiz not found');
    }
  }

  async findByCourseId(courseId: string): Promise<Quiz[]> {
    return this.quizzesRepository.find({
      where: { course: { id: courseId } },
      relations: ['questions'],
      order: {
        questions: {
          order: 'ASC',
        },
      },
    });
  }
}