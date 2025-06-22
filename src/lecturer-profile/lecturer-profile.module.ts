import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Course } from '../Lecturer/courses/entities/course.entity';
import { Education } from './entities/education.entity';
import { SocialMedia } from './entities/social-media.entity';
import { LecturerProfileController } from './lecturer-profile.controller';
import { LecturerProfileService } from './lecturer-profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Education,
            SocialMedia,
            Course,
        ]),
    ],
    controllers: [LecturerProfileController],
    providers: [LecturerProfileService],
})
export class LecturerProfileModule { }
