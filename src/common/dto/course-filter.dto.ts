import { IsDecimal, IsOptional } from 'class-validator';
import { NameFilterDto } from 'common/querying/dto/name-filter.dto';

export class CourseFilterDto extends NameFilterDto {
  @IsOptional()
  @IsDecimal()
  readonly ratings?: number;

  @IsOptional()
  readonly language?: string;

  @IsOptional()
  readonly level?: string;

  @IsOptional()
  readonly duration?: string;

  @IsOptional()
  readonly features?: string;

  @IsOptional()
  readonly price?: string;

  @IsOptional()
  readonly topic?: string;
}
