import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseLevel, Language } from 'common';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  @IsEnum(CourseLevel)
  courseLevel?: CourseLevel;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsString()
  @IsEnum(Language)
  language: Language;

  @IsString()
  categoryId: string;
}
