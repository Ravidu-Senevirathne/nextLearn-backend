import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumberString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  topics: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  requirements: string[];
}
