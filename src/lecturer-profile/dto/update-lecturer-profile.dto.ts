import { IsOptional, IsString, MaxLength, IsArray, IsDateString } from 'class-validator';

export class UpdateLecturerProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    location?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    officeHours?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsDateString()
    joinDate?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    expertise?: string[];
}
