import { IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsString()
  sectionId: string;
}
