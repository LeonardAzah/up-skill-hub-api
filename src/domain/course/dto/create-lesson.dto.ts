import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { LessonType } from 'course/enums/lessons-type.enum';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsEnum(LessonType)
  lessonType: LessonType;

  @IsUrl()
  contentUrl: string;

  @IsString()
  sectionId: string;
}
