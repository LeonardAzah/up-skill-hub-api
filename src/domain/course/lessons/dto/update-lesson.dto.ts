import { IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsString()
  lessonId: string;
}
