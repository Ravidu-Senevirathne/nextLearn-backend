import { Controller, Get, Put, Param, Body, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LecturerProfileService } from './lecturer-profile.service';
import { UpdateLecturerProfileDto } from './dto/update-lecturer-profile.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { UserRole } from '../user/entities/user.entity';

@Controller('lecturer-profile')
export class LecturerProfileController {
    constructor(
        private readonly lecturerService: LecturerProfileService,
    ) { }

    @Get(':id')
    async getLecturerProfile(@Param('id') id: number) {
        return this.lecturerService.getProfile(id);
    }

    @Get(':id/courses')
    async getLecturerCourses(@Param('id') id: number) {
        return this.lecturerService.getCourses(id);
    }

    @Get(':id/stats')
    async getLecturerStats(@Param('id') id: number) {
        return this.lecturerService.getStats(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async updateProfile(
        @Param('id') id: number,
        @Request() req,
        @Body() updateDto: UpdateLecturerProfileDto,
    ) {
        // Verify the user is updating their own profile or is an admin
        if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only update your own profile');
        }

        return this.lecturerService.updateProfile(id, updateDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id/social-media')
    async updateSocialMedia(
        @Param('id') id: number,
        @Request() req,
        @Body() updateDto: UpdateSocialMediaDto,
    ) {
        // Verify the user is updating their own profile or is an admin
        if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('You can only update your own profile');
        }

        return this.lecturerService.updateSocialMedia(id, updateDto);
    }
}
