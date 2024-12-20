import { IsOptional, IsString } from 'class-validator';

export class NameFilterDto {
  @IsOptional()
  @IsString()
  readonly q?: string;
}
