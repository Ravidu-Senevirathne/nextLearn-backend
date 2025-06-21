import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './Lecturer/courses/courses.module';
import { LessonsModule } from './Lecturer/lessons/lessons.module';
import { AssignmentsModule } from './Lecturer/assignments/assignments.module';
import { QuizModule } from './Lecturer/quiz/quiz.module';
import { ExamModule } from './Lecturer/exam/exam.module';
import { GroupsModule } from './Lecturer/groups/groups.module';
import { EnrollmentsModule } from './Lecturer/enrollments/enrollments.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nextlearn',
      autoLoadEntities: true,
      synchronize: true,
      logging: true, // Enable logging to debug SQL queries
    })
    , ReviewModule, UserModule, AuthModule, CoursesModule, LessonsModule, AssignmentsModule, QuizModule, ExamModule, GroupsModule, EnrollmentsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
