import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class EnrollmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  enrollmentDate: string;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}