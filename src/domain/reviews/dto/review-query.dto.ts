import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'common';
import { ReviewFilterDto } from './review-filter.dto';

export class ReviewQueryDto extends IntersectionType(
  PaginationDto,
  ReviewFilterDto,
) {}
