import { IsOptional, IsString, NotEquals } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
