import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { name: string; email: string; mobile: string; password: string; role: UserRole }) {
        return this.authService.register(body.name, body.email, body.mobile, body.password, body.role);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const result = await this.authService.login(body.email, body.password);
        return {
            user: {
                id: result.id,
                email: result.email,
                name: result.name,
                role: result.role
            },
            token: result.access_token
        };
    }
}
