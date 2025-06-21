import { IsNotEmpty, IsString, IsInt, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamQuestionOptionDto } from './create-exam-question-option.dto';

export class CreateExamQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

  @IsNotEmpty()
  @IsInt()
  marks: number;

  @IsNotEmpty()
  @IsInt()
  order: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionOptionDto)
  options?: CreateExamQuestionOptionDto[];
}