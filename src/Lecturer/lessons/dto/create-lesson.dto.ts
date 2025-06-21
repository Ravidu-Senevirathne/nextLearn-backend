import { IsNotEmpty, IsString, IsOptional, IsIn, IsUrl, IsInt } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsNotEmpty()
  @IsIn(['video', 'document'])
  contentType: string;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsNotEmpty()
  @IsIn(['draft', 'published'])
  status: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;
}