import { IsEnum, IsString } from 'class-validator';
import { Language } from 'common';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(Language)
  language: Language;

  @IsString()
  categoryId: string;
}
