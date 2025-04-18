import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true; // If no roles are specified, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !requiredRoles.includes(user.role)) {
            throw new UnauthorizedException('Access denied');
        }

        return true;
    }
}
