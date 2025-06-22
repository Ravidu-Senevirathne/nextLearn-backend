import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from '../../user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) { }

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    const student = await this.usersRepository.findOne({
      where: { id: parseInt(createGradeDto.studentId) },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const assignment = await this.assignmentsRepository.findOne({
      where: { id: createGradeDto.assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const course = await this.coursesRepository.findOne({
      where: { id: createGradeDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const grade = this.gradesRepository.create({
      ...createGradeDto,
      student,
      assignment,
      course,
    });

    return this.gradesRepository.save(grade);
  }

  async findAll(
    search?: string,
    courseId?: string,
    assignmentId?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Grade[]; count: number }> {
    const query = this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.student', 'student')
      .leftJoinAndSelect('grade.assignment', 'assignment')
      .leftJoinAndSelect('grade.course', 'course');

    if (search) {
      query.where(
        '(student.name LIKE :search OR assignment.title LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (courseId) {
      query.andWhere('course.id = :courseId', { courseId });
    }

    if (assignmentId) {
      query.andWhere('assignment.id = :assignmentId', { assignmentId });
    }

    const [data, count] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: string): Promise<Grade> {
    const grade = await this.gradesRepository.findOne({
      where: { id },
      relations: ['student', 'assignment', 'course'],
    });

    if (!grade) {
      throw new NotFoundException('Grade not found');
    }

    return grade;
  }

  async update(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const grade = await this.findOne(id);

    if (updateGradeDto.studentId) {
      const student = await this.usersRepository.findOne({
        where: { id: parseInt(updateGradeDto.studentId) },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      grade.student = student;
    }

    if (updateGradeDto.assignmentId) {
      const assignment = await this.assignmentsRepository.findOne({
        where: { id: updateGradeDto.assignmentId },
      });

      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }

      grade.assignment = assignment;
    }

    if (updateGradeDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateGradeDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      grade.course = course;
    }

    Object.assign(grade, updateGradeDto);
    return this.gradesRepository.save(grade);
  }

  async remove(id: string): Promise<void> {
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Grade not found');
    }
  }

  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { student: { id: parseInt(studentId) } },
      relations: ['assignment', 'course'],
    });
  }

  async getGradesByCourse(courseId: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { course: { id: courseId } },
      relations: ['student', 'assignment'],
    });
  }

  async getGradesByAssignment(assignmentId: string): Promise<Grade[]> {
    return this.gradesRepository.find({
      where: { assignment: { id: assignmentId } },
      relations: ['student', 'course'],
    });
  }

  async exportGrades(courseId?: string): Promise<any[]> {
    const query = this.gradesRepository
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.student', 'student')
      .leftJoinAndSelect('grade.assignment', 'assignment')
      .leftJoinAndSelect('grade.course', 'course');

    if (courseId) {
      query.where('course.id = :courseId', { courseId });
    }

    const grades = await query.getMany();

    return grades.map(grade => [
      grade.student.name,
      grade.assignment.title,
      grade.score,
      grade.assignment.totalPoints,
      grade.assignment.totalPoints ?
        `${(grade.score / grade.assignment.totalPoints * 100).toFixed(2)}%` :
        'N/A',
      grade.feedback || '',
      grade.submittedAt?.toISOString() || '',
      grade.createdAt?.toISOString() || '', // Use createdAt instead of gradedAt
    ]);
  }
}