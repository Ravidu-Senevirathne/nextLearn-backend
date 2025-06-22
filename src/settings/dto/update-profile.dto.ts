import { IsOptional, IsString, MaxLength, IsEmail, IsIn } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsIn(['public', 'students', 'private'])
    profileVisibility?: 'public' | 'students' | 'private';

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
