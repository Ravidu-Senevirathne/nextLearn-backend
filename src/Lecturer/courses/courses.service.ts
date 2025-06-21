import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto, lecturer: User): Promise<Course> {
    // Convert price from string to number
    const course = this.courseRepo.create({
      ...createCourseDto,
      price: parseFloat(createCourseDto.price),
      lecturer,
    });
    return await this.courseRepo.save(course);
  }

  async findAll() {
    return await this.courseRepo.find();
  }

  async findOne(id: string) {
    return await this.courseRepo.findOne({ where: { id } });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // Destructure to separate price from other properties
    const { price, ...restOfDto } = updateCourseDto;

    // Create update data without the price property
    const updateData: Partial<Course> = { ...restOfDto };

    // Convert price from string to number if it exists
    if (price) {
      updateData.price = parseFloat(price);
    }

    await this.courseRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    await this.courseRepo.delete(id);
    return course;
  }
}