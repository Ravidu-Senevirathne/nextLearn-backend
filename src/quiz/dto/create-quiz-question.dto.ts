import { IsNotEmpty, IsString, IsArray, IsOptional, IsInt, ValidateIf } from 'class-validator';

export class CreateQuizQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

  @ValidateIf(o => o.type === 'multiple-choice')
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ValidateIf(o => o.type !== 'essay')
  @IsNotEmpty()
  correctAnswer?: string | string[];

  @IsOptional()
  @IsInt()
  points?: number;

  @IsNotEmpty()
  @IsInt()
  order: number;
}