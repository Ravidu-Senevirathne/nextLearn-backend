import { IsNotEmpty, IsString, IsInt, IsBoolean, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamQuestionDto } from './create-exam-question.dto';

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsInt()
  duration: number;

  @IsNotEmpty()
  @IsInt()
  passingPercentage: number;

  @IsBoolean()
  shuffleQuestions: boolean;

  @IsBoolean()
  showResults: boolean;

  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionDto)
  questions: CreateExamQuestionDto[];
}