import { IntersectionType } from '@nestjs/swagger';
import { CoursesFilterDto, PaginationDto } from 'common';

export class CoursesQueryDto extends IntersectionType(
  PaginationDto,
  CoursesFilterDto,
) {}
