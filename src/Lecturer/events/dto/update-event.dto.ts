import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsOptional()
    @IsEnum(EventType)
    type?: EventType;
}