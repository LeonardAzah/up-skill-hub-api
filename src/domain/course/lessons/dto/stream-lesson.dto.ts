import { IsNotEmpty, IsString } from 'class-validator';

export class StreamLessonDto {
  @IsNotEmpty()
  @IsString()
  publicId: string;
}
