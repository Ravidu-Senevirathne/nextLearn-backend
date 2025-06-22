import { ApiProperty } from '@nestjs/swagger';

export class GradeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ required: false })
  feedback?: string;

  @ApiProperty()
  percentage: number;

  @ApiProperty()
  submittedAt: Date;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  assignmentTitle: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}