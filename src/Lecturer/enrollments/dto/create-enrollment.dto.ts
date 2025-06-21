import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsDateString
} from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsNumberString() // Changed from IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsDateString()
  enrollmentDate: Date;

  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;

  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;
}