import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    startTime: string;

    @IsNotEmpty()
    @IsString()
    endTime: string;

    @IsEnum(EventType)
    type: EventType;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    courseId?: string;
}