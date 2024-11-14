import { IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  title: string;

  @IsString()
  sectionId: string;
}
