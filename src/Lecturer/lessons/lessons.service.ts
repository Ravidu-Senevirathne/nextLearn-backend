import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const course = await this.coursesRepository.findOne({
      where: { id: createLessonDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = this.lessonsRepository.create({
      ...createLessonDto,
      course,
    });

    return this.lessonsRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return this.lessonsRepository.find({ relations: ['course'] });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);

    if (updateLessonDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateLessonDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      lesson.course = course;
    }

    Object.assign(lesson, updateLessonDto);
    return this.lessonsRepository.save(lesson);
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Lesson not found');
    }
  }

  async findByCourseId(courseId: string): Promise<Lesson[]> {
    return this.lessonsRepository.find({
      where: { course: { id: courseId } },
      relations: ['course'],
    });
  }
}