import {
    Controller, Get, Put, Post, Delete, Param, Body, Request,
    UseGuards, HttpCode, HttpStatus, ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
    ) { }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user profile settings' })
    @ApiResponse({ status: 200, description: 'Returns user profile settings' })
    async getProfile(@Request() req) {
        return this.settingsService.getProfile(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update user profile settings' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    async updateProfile(
        @Request() req,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.settingsService.updateProfile(req.user.id, updateProfileDto);
    }

    @Get('notifications')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get notification settings' })
    @ApiResponse({ status: 200, description: 'Returns notification settings' })
    async getNotificationSettings(@Request() req) {
        return this.settingsService.getNotificationSettings(req.user.id);
    }

    @Put('notifications')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update notification settings' })
    @ApiResponse({ status: 200, description: 'Notification settings updated' })
    async updateNotificationSettings(
        @Request() req,
        @Body() updateDto: UpdateNotificationSettingsDto,
    ) {
        return this.settingsService.updateNotificationSettings(req.user.id, updateDto);
    }

    @Get('connected-accounts')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get connected accounts' })
    @ApiResponse({ status: 200, description: 'Returns connected accounts' })
    async getConnectedAccounts(@Request() req) {
        return this.settingsService.getConnectedAccounts(req.user.id);
    }

    @Post('connected-accounts/:provider')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Connect a social account' })
    @ApiResponse({ status: 200, description: 'Account connected successfully' })
    async connectAccount(
        @Request() req,
        @Param('provider') provider: 'google' | 'github' | 'linkedin',
    ) {
        return this.settingsService.connectAccount(req.user.id, provider);
    }

    @Delete('connected-accounts/:provider')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Disconnect a social account' })
    @ApiResponse({ status: 200, description: 'Account disconnected successfully' })
    async disconnectAccount(
        @Request() req,
        @Param('provider') provider: 'google' | 'github' | 'linkedin',
    ) {
        return this.settingsService.disconnectAccount(req.user.id, provider);
    }

    @Get('sessions')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user sessions' })
    @ApiResponse({ status: 200, description: 'Returns user sessions' })
    async getSessions(@Request() req) {
        return this.settingsService.getSessions(req.user.id);
    }

    @Delete('sessions/:id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Revoke a specific session' })
    @ApiResponse({ status: 204, description: 'Session revoked successfully' })
    async revokeSession(
        @Request() req,
        @Param('id', ParseIntPipe) sessionId: number,
    ) {
        return this.settingsService.revokeSession(sessionId, req.user.id);
    }

    @Delete('sessions')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Revoke all sessions except current' })
    @ApiResponse({ status: 204, description: 'All sessions revoked successfully' })
    async revokeAllSessions(@Request() req) {
        return this.settingsService.revokeAllSessions(req.user.id, req.headers.authorization?.split(' ')[1]);
    }

    @Post('two-factor')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Toggle two-factor authentication' })
    @ApiResponse({ status: 200, description: 'Two-factor settings updated' })
    async toggleTwoFactorAuth(
        @Request() req,
        @Body() { enable }: { enable: boolean },
    ) {
        return this.settingsService.toggleTwoFactorAuth(req.user.id, enable);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.settingsService.changePassword(
            req.user.id,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
    }

    @Delete('account')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete user account' })
    @ApiResponse({ status: 204, description: 'Account deleted successfully' })
    async deleteAccount(@Request() req) {
        return this.settingsService.deleteAccount(req.user.id);
    }
}
