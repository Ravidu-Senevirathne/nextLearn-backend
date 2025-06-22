import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { NotificationSettings } from './entities/notification-settings.entity';
import { ConnectedAccounts } from './entities/connected-accounts.entity';
import { Session } from './entities/session.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(NotificationSettings)
        private notificationSettingsRepo: Repository<NotificationSettings>,
        @InjectRepository(ConnectedAccounts)
        private connectedAccountsRepo: Repository<ConnectedAccounts>,
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,
    ) { }

    async getProfile(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: [
                'id', 'name', 'email', 'mobile', 'firstName', 'lastName', 'bio',
                'profileVisibility', 'language', 'timezone', 'twoFactorEnabled', 'avatarUrl'
            ],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateProfile(userId: number, updateDto: UpdateProfileDto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if email is being updated and if it's already used
        if (updateDto.email && updateDto.email !== user.email) {
            const existingUser = await this.userRepo.findOne({ where: { email: updateDto.email } });
            if (existingUser) {
                throw new BadRequestException('Email already in use');
            }
        }

        await this.userRepo.update(userId, updateDto);
        return this.getProfile(userId);
    }

    async getNotificationSettings(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['notificationSettings']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.notificationSettings) {
            // Create default notification settings if they don't exist
            const settings = this.notificationSettingsRepo.create({ user: { id: userId } });
            await this.notificationSettingsRepo.save(settings);
            return settings;
        }

        return user.notificationSettings;
    }

    async updateNotificationSettings(userId: number, updateDto: UpdateNotificationSettingsDto) {
        const settings = await this.getNotificationSettings(userId);

        Object.assign(settings, updateDto);
        await this.notificationSettingsRepo.save(settings);

        return settings;
    }

    async getConnectedAccounts(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['connectedAccounts']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.connectedAccounts) {
            // Create default connected accounts if they don't exist
            const accounts = this.connectedAccountsRepo.create({ user: { id: userId } });
            await this.connectedAccountsRepo.save(accounts);
            return accounts;
        }

        return user.connectedAccounts;
    }

    async connectAccount(userId: number, provider: 'google' | 'github' | 'linkedin') {
        const accounts = await this.getConnectedAccounts(userId);

        accounts[provider] = true;
        await this.connectedAccountsRepo.save(accounts);

        return accounts;
    }

    async disconnectAccount(userId: number, provider: 'google' | 'github' | 'linkedin') {
        const accounts = await this.getConnectedAccounts(userId);

        accounts[provider] = false;
        await this.connectedAccountsRepo.save(accounts);

        return accounts;
    }

    async getSessions(userId: number) {
        return this.sessionRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async revokeSession(sessionId: number, userId: number) {
        const session = await this.sessionRepo.findOne({
            where: { id: sessionId, user: { id: userId } }
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        await this.sessionRepo.remove(session);
        return { success: true };
    }

    async revokeAllSessions(userId: number, exceptCurrent?: string) {
        const query = this.sessionRepo
            .createQueryBuilder()
            .delete()
            .from(Session)
            .where('userId = :userId', { userId });

        if (exceptCurrent) {
            query.andWhere('token != :token', { token: exceptCurrent });
        }

        await query.execute();
        return { success: true };
    }

    async toggleTwoFactorAuth(userId: number, enable: boolean) {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.twoFactorEnabled = enable;
        await this.userRepo.save(user);

        return { twoFactorEnabled: enable };
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: ['id', 'password']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await this.userRepo.save(user);

        return { success: true, message: 'Password changed successfully' };
    }

    async deleteAccount(userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepo.remove(user);
        return { success: true };
    }
}
