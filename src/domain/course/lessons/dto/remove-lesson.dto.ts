import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveLessonDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
