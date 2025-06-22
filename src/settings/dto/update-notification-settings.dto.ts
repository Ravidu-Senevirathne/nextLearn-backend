import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationSettingsDto {
    @IsOptional()
    @IsBoolean()
    courseUpdates?: boolean;

    @IsOptional()
    @IsBoolean()
    studentMessages?: boolean;

    @IsOptional()
    @IsBoolean()
    studentSubmissions?: boolean;

    @IsOptional()
    @IsBoolean()
    platformAnnouncements?: boolean;

    @IsOptional()
    @IsBoolean()
    marketingEmails?: boolean;
}
