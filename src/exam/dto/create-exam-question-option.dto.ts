import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateExamQuestionOptionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}