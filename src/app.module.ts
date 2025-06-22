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
import { EventsModule } from './Lecturer/events/events.module';
import { GradesModule } from './Lecturer/grades/grades.module';
import { ProgressModule } from './Lecturer/progress/progress.module';
import { MessagesModule } from './messaging/messages.module';


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
      logging: true,
    }),
    ReviewModule, UserModule, AuthModule, CoursesModule, LessonsModule,
    AssignmentsModule, QuizModule, ExamModule, GroupsModule,
    EnrollmentsModule, EventsModule, GradesModule, ProgressModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
