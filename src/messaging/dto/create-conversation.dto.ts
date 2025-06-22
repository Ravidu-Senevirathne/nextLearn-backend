import { IsOptional, IsString, IsBoolean, IsArray, ArrayMinSize, ArrayMaxSize, IsNumber, ValidateIf } from 'class-validator';

export class CreateConversationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsBoolean()
    isGroup: boolean;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    courseId?: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one participant is required' })
    @ArrayMaxSize(20, { message: 'Maximum 20 participants allowed' })
    participantIds: number[];

    @ValidateIf(o => o.isGroup)
    @IsString()
    groupName?: string;
}
