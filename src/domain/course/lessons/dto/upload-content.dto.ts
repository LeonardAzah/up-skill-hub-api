import { IsString } from 'class-validator';

export class UploadContentDto {
  @IsString()
  lessonId: string;
}
