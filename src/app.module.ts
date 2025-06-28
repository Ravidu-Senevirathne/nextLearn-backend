import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
import { LecturerProfileModule } from './lecturer-profile/lecturer-profile.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => (Math.round(Math.random() * 16)).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'), // Changed from 'DB_DATABASE' to 'DB_NAME'
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNC') === 'true',
      }),
    }),
    ReviewModule, UserModule, AuthModule, CoursesModule, LessonsModule,
    AssignmentsModule, QuizModule, ExamModule, GroupsModule,
    EnrollmentsModule, EventsModule, GradesModule, ProgressModule,
    MessagesModule, LecturerProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
