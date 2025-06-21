import { IsNotEmpty, IsString, IsOptional, IsUUID, IsNumberString } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsUUID()
    courseId: string;

    @IsOptional()
    // Replace the UUID validation with something appropriate for your numeric IDs
    @IsNumberString({}, { each: true })
    memberIds?: string[];
}