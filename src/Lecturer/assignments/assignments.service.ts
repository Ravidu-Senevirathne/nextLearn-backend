import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Course } from '../courses/entities/course.entity';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentsRepository: Repository<Assignment>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) { }

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const course = await this.coursesRepository.findOne({
      where: { id: createAssignmentDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const assignment = this.assignmentsRepository.create({
      ...createAssignmentDto,
      course,
    });

    return this.assignmentsRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentsRepository.find({ relations: ['course'] });
  }

  async findOne(id: string): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);

    if (updateAssignmentDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateAssignmentDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      assignment.course = course;
    }

    Object.assign(assignment, updateAssignmentDto);
    return this.assignmentsRepository.save(assignment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.assignmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Assignment not found');
    }
  }

  async findByCourseId(courseId: string): Promise<Assignment[]> {
    return this.assignmentsRepository.find({
      where: { course: { id: courseId } },
      relations: ['course'],
    });
  }

  async createWithFiles(createAssignmentDto: CreateAssignmentDto, files: Express.Multer.File[]) {
    const uploadDir = './uploads';
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }
    const filePaths = files.map(file => `/uploads/${file.filename}`);
    return this.create({
      ...createAssignmentDto,
      attachments: filePaths,
    });
  }
}