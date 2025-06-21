import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: EventType })
  type: EventType;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  courseTitle?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}