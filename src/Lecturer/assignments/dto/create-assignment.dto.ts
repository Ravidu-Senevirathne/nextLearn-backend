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
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsInt()
  totalPoints?: number;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsNotEmpty()
  @IsString()
  courseId: string;
}