import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { LessonType } from 'course/enums/lessons-type.enum';

export class UpdateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsString()
  lessonId: string;
}
