import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentStatus } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Convert string ID to number
    const studentId = Number(createEnrollmentDto.studentId);

    if (isNaN(studentId)) {
      throw new NotFoundException('Invalid student ID format');
    }

    const student = await this.usersRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.coursesRepository.findOne({
      where: { id: createEnrollmentDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrollment = this.enrollmentsRepository.create({
      ...createEnrollmentDto,
      student,
      course,
    });

    return this.enrollmentsRepository.save(enrollment);
  }

  async findAll(
    search?: string,
    status?: EnrollmentStatus,
    courseId?: string,
    startDate?: Date,
    endDate?: Date,
    page = 1,
    limit = 10,
  ): Promise<{ data: Enrollment[]; count: number }> {
    const query = this.enrollmentsRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course')
      .select([
        'enrollment',
        'student.id',
        'student.firstName',
        'student.lastName',
        'course.id',
        'course.title',
      ]);

    if (search) {
      query.where(
        '(student.firstName LIKE :search OR student.lastName LIKE :search OR course.title LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('enrollment.status = :status', { status });
    }

    if (courseId) {
      query.andWhere('course.id = :courseId', { courseId });
    }

    if (startDate && endDate) {
      query.andWhere({
        enrollmentDate: Between(startDate, endDate),
      });
    }

    const [data, count] = await query
      .orderBy('enrollment.enrollmentDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findOne(id);

    if (updateEnrollmentDto.studentId) {
      // Convert string ID to number
      const studentId = Number(updateEnrollmentDto.studentId);

      if (isNaN(studentId)) {
        throw new NotFoundException('Invalid student ID format');
      }

      const student = await this.usersRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      enrollment.student = student;
    }

    if (updateEnrollmentDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateEnrollmentDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      enrollment.course = course;
    }

    Object.assign(enrollment, updateEnrollmentDto);
    return this.enrollmentsRepository.save(enrollment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.enrollmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Enrollment not found');
    }
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    inactive: number;
  }> {
    const [total, active, completed, inactive] = await Promise.all([
      this.enrollmentsRepository.count(),
      this.enrollmentsRepository.count({ where: { status: EnrollmentStatus.ACTIVE } }),
      this.enrollmentsRepository.count({ where: { status: EnrollmentStatus.COMPLETED } }),
      this.enrollmentsRepository.count({ where: { status: EnrollmentStatus.INACTIVE } }),
    ]);

    return { total, active, completed, inactive };
  }
}