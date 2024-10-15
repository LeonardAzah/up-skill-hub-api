import { IsOptional, Max } from 'class-validator';
import { IsCardinal } from 'common/Decorators';
import { MAX_PAGE_NUMBER, MAX_PAGE_SIZE } from 'common/utils';

export class PaginationDto {
  @IsOptional()
  @Max(MAX_PAGE_SIZE)
  @IsCardinal()
  readonly limit?: number;

  @IsOptional()
  @Max(MAX_PAGE_NUMBER)
  @IsCardinal()
  readonly page?: number = 1;
}
