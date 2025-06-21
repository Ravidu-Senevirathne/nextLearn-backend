import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Course } from '../courses/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const course = await this.coursesRepository.findOne({
      where: { id: createGroupDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const group = this.groupsRepository.create({
      ...createGroupDto,
      course,
    });

    if (createGroupDto.memberIds && createGroupDto.memberIds.length > 0) {
      const members = await this.usersRepository.find({
        where: { id: In(createGroupDto.memberIds) },
      });
      group.members = members;
      group.memberCount = members.length;
    }

    return this.groupsRepository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupsRepository.find({
      relations: ['course', 'members'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['course', 'members'],
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);

    if (updateGroupDto.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateGroupDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      group.course = course;
    }

    if (updateGroupDto.memberIds) {
      const members = await this.usersRepository.find({
        where: { id: In(updateGroupDto.memberIds) },
      });
      group.members = members;
      group.memberCount = members.length;
    }

    Object.assign(group, updateGroupDto);
    return this.groupsRepository.save(group);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Group not found');
    }
  }

  async findByCourseId(courseId: string): Promise<Group[]> {
    return this.groupsRepository.find({
      where: { course: { id: courseId } },
      relations: ['members'],
      order: { createdAt: 'DESC' },
    });
  }

  async addMembers(groupId: string, userIds: string[]): Promise<Group> {
    const group = await this.findOne(groupId);
    const users = await this.usersRepository.find({
      where: { id: In(userIds) },
    });

    // Filter out existing members
    const newUsers = users.filter(
      user => !group.members.some(member => member.id === user.id),
    );

    group.members = [...group.members, ...newUsers];
    group.memberCount = group.members.length;
    return this.groupsRepository.save(group);
  }
  async removeMembers(groupId: string, userIds: string[]): Promise<Group> {
    const group = await this.findOne(groupId);
    group.members = group.members.filter(
      member => !userIds.includes(String(member.id)),
    );
    group.memberCount = group.members.length;
    return this.groupsRepository.save(group);
  }

 
async searchGroups(
  searchQuery?: string,
  status?: 'active' | 'archived' | 'completed',
  courseId?: string,
  page = 1,
  limit = 10,
): Promise<{ data: Group[]; count: number }> {
  const query = this.groupsRepository
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.course', 'course')
    .leftJoinAndSelect('group.members', 'members');

  if (searchQuery) {
    query.where(
      '(group.name LIKE :search OR group.description LIKE :search)',
      { search: `%${searchQuery}%` },
    );
  }

  if (status) {
    query.andWhere('group.status = :status', { status });
  }

  if (courseId) {
    query.andWhere('group.courseId = :courseId', { courseId });
  }

  const [data, count] = await query
    .orderBy('group.createdAt', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { data, count };
}
  

  async getGroupStats() {
    const [totalGroups, activeGroups] = await Promise.all([
      this.groupsRepository.count(),
      this.groupsRepository.count({ where: { status: 'active' } }),



      
    ]);

    

    

    const totalMembersResult = await this.groupsRepository
      .createQueryBuilder('group')
      .select('SUM(group.memberCount)', 'totalMembers')
      .getRawOne();

    return {
      totalGroups,
      activeGroups,
      totalMembers: parseInt(totalMembersResult.totalMembers) || 0,
    };
  }
}