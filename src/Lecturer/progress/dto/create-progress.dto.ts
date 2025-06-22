import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateProgressDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    courseId: string;

    @IsOptional()
    @IsUUID()
    lessonId?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    percentage: number;

    @IsNumber()
    @Min(0)
    timeSpentMinutes: number;
}
