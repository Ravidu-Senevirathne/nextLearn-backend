import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  dueDate: string; // Changed from Date to string to handle ISO string from frontend

  @IsOptional()
  @Type(() => Number) // Needed for conversion from string to number
  @IsInt()
  totalPoints?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsNotEmpty()
  @IsString()
  courseId: string;
}