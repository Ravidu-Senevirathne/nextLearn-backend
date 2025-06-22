import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max, IsNumberString } from 'class-validator';

export class CreateGradeDto {
  @IsNotEmpty()
  @IsNumberString()
  studentId: string;

  @IsNotEmpty()
  @IsUUID()
  assignmentId: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score: number;

  @IsString()
  feedback?: string;

  @IsNotEmpty()
  submittedAt: Date;
}