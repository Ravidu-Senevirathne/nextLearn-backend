import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Course } from '../Lecturer/courses/entities/course.entity';
import { Education } from './entities/education.entity';
import { SocialMedia } from './entities/social-media.entity';
import { UpdateLecturerProfileDto } from './dto/update-lecturer-profile.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';

@Injectable()
export class LecturerProfileService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Education)
        private educationRepo: Repository<Education>,
        @InjectRepository(SocialMedia)
        private socialMediaRepo: Repository<SocialMedia>,
        @InjectRepository(Course)
        private courseRepo: Repository<Course>,
    ) { }

    async getProfile(id: number) {
        const user = await this.userRepo.findOne({
            where: { id, role: UserRole.LECTURER },
            relations: ['education', 'socialMedia'],
        });

        if (!user) {
            throw new NotFoundException('Lecturer not found');
        }

        return user;
    }

    async getCourses(id: number) {
        const lecturer = await this.userRepo.findOne({
            where: { id, role: UserRole.LECTURER },
        });

        if (!lecturer) {
            throw new NotFoundException('Lecturer not found');
        }

        return this.courseRepo.find({
            where: { lecturer: { id } },
        });
    }

    async getStats(id: number) {
        const lecturer = await this.userRepo.findOne({
            where: { id, role: UserRole.LECTURER },
        });

        if (!lecturer) {
            throw new NotFoundException('Lecturer not found');
        }

        const courses = await this.courseRepo.find({
            where: { lecturer: { id } },
        });

        return {
            coursesCount: courses.length,
            totalStudents: courses.reduce((sum, course) => sum + (course as any).studentCount || 0, 0),
        };
    }

    async updateProfile(id: number, updateDto: UpdateLecturerProfileDto) {
        const user = await this.userRepo.findOneBy({ id, role: UserRole.LECTURER });

        if (!user) {
            throw new NotFoundException('Lecturer not found');
        }

        // Convert expertise string to array if needed
       if (typeof updateDto.expertise === 'string') {
    updateDto.expertise = (updateDto.expertise as string).split(',').map(item => item.trim());
}


        await this.userRepo.update(id, updateDto);
        return this.getProfile(id);
    }

    async updateSocialMedia(id: number, updateDto: UpdateSocialMediaDto) {
        const user = await this.userRepo.findOneBy({ id, role: UserRole.LECTURER });

        if (!user) {
            throw new NotFoundException('Lecturer not found');
        }

        let socialMedia = await this.socialMediaRepo.findOne({
            where: { user: { id } },
        });

        if (!socialMedia) {
            socialMedia = this.socialMediaRepo.create({
                user: { id },
                ...updateDto,
            });
        } else {
            this.socialMediaRepo.merge(socialMedia, updateDto);
        }

        await this.socialMediaRepo.save(socialMedia);
        return socialMedia;
    }
}
