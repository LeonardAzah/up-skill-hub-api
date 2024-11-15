import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveSectionDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
