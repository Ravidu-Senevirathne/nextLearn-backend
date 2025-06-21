import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../../user/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventType } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const course = await this.coursesRepository.findOne({
      where: { id: createEventDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const event = this.eventsRepository.create({
      ...createEventDto,
      course,
    });

    return this.eventsRepository.save(event);
  }

  async findAll(
    type?: EventType,
    courseId?: string,
    startDate?: Date,
    endDate?: Date,
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: Event[]; count: number }> {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.course', 'course')
      .leftJoinAndSelect('event.creator', 'creator')
      .select([
        'event',
        'course.id',
        'course.title',
        'creator.id',
        'creator.firstName',
        'creator.lastName',
      ]);

    if (type) {
      query.andWhere('event.type = :type', { type });
    }

    if (courseId) {
      query.andWhere('course.id = :courseId', { courseId });
    }

    if (startDate && endDate) {
      query.andWhere({
        date: Between(startDate, endDate),
      });
    }

    if (search) {
      query.andWhere(
        '(event.title LIKE :search OR event.description LIKE :search OR course.title LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, count] = await query
      .orderBy('event.date', 'ASC')
      .addOrderBy('event.startTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['course', 'creator'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (updateEventDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateEventDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      event.course = course;
    } else if (updateEventDto.courseId === null || updateEventDto.courseId === '') {
      // Remove course association
      delete updateEventDto.courseId;
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Event not found');
    }
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['course'],
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async getUpcomingEvents(limit = 5): Promise<Event[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.eventsRepository.find({
      where: {
        date: Between(today, new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
      },
      relations: ['course'],
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
      take: limit,
    });
  }
}