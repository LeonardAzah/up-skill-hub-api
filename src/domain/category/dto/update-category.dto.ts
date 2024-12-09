import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { IdDto } from 'common';

export class UpdateCategoryDto {
  @IsString()
  name: string;

  @IsUUID()
  id: string;
}
