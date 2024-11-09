import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { LessonType } from 'course/enums/lessons-type.enum';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;
}
