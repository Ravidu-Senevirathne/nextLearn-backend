import { PartialType } from '@nestjs/swagger';
import { CreateGradeDto } from './create-grade.dto';
import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class UpdateGradeDto extends PartialType(CreateGradeDto) {
  @IsOptional()
  @IsNumberString()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  assignmentId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;
}