import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return { message: 'Protected route', user: req.user };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin-only')
    adminOnly(@Request() req) {
        return { message: 'Admin access granted', user: req.user };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.LECTURER)
    @Get('lecturer-only')
    lecturerOnly(@Request() req) {
        return { message: 'Lecturer access granted', user: req.user };
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.STUDENT)
    @Get('student-only')
    studentOnly(@Request() req) {
        return { message: 'Student access granted', user: req.user };
    }
}
