import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { NameFilterDto } from 'common';

export class ReviewFilterDto extends NameFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  ratings?: number;
}
