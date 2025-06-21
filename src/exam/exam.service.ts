import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Course } from '../courses/entities/course.entity';
import { ExamQuestion } from './entities/exam-question.entity';
import { ExamQuestionOption } from './entities/exam-question-option.entity';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(ExamQuestion)
    private questionsRepository: Repository<ExamQuestion>,
    @InjectRepository(ExamQuestionOption)
    private optionsRepository: Repository<ExamQuestionOption>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const course = await this.coursesRepository.findOne({
      where: { id: createExamDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const exam = this.examsRepository.create({
      ...createExamDto,
      course,
    });

    const savedExam = await this.examsRepository.save(exam);

    // Save questions and options
    if (createExamDto.questions && createExamDto.questions.length > 0) {
      await this.saveQuestionsWithOptions(savedExam, createExamDto.questions);
    }

    return this.findOne(savedExam.id);
  }

  private async saveQuestionsWithOptions(exam: Exam, questions: CreateExamQuestionDto[]) {
    for (const questionDto of questions) {
      const question = this.questionsRepository.create({
        ...questionDto,
        exam,
      });

      const savedQuestion = await this.questionsRepository.save(question);

      if (questionDto.options && questionDto.options.length > 0) {
        const options = questionDto.options.map(optionDto =>
          this.optionsRepository.create({
            ...optionDto,
            question: savedQuestion,
          }),
        );
        await this.optionsRepository.save(options);
      }
    }
  }

  async findAll(): Promise<Exam[]> {
    return this.examsRepository.find({
      relations: ['course', 'questions', 'questions.options'],
      order: {
        createdAt: 'DESC',
        questions: {
          order: 'ASC',
        },
      },
    });
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examsRepository.findOne({
      where: { id },
      relations: ['course', 'questions', 'questions.options'],
      order: {
        questions: {
          order: 'ASC',
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);

    if (updateExamDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateExamDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      exam.course = course;
    }

    Object.assign(exam, updateExamDto);

    // Update questions if provided
    if (updateExamDto.questions) {
      // Remove existing questions and options
      await this.questionsRepository.delete({ exam: { id } });

      // Add new questions
      await this.saveQuestionsWithOptions(exam, updateExamDto.questions);
    }

    await this.examsRepository.save(exam);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.examsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Exam not found');
    }
  }

  async findByCourseId(courseId: string): Promise<Exam[]> {
    return this.examsRepository.find({
      where: { course: { id: courseId } },
      relations: ['questions'],
      order: {
        createdAt: 'DESC',
        questions: {
          order: 'ASC',
        },
      },
    });
  }

  async changeStatus(id: string, status: 'draft' | 'published'): Promise<Exam> {
    const exam = await this.findOne(id);
    exam.status = status;
    return this.examsRepository.save(exam);
  }

  async calculateTotalMarks(id: string): Promise<number> {
    const exam = await this.findOne(id);
    return exam.questions.reduce((sum, question) => sum + question.marks, 0);
  }
}