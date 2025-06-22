import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSocialMediaDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    website?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    twitter?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    linkedin?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    github?: string;
}
