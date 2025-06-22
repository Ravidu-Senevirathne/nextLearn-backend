import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade } from './entities/grade.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, Assignment, User, Course])],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}