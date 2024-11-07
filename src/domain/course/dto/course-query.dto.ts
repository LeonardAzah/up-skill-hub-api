import { IntersectionType } from '@nestjs/swagger';
import { CoursesFilterDto, CourseSortDto, PaginationDto } from 'common';

export class CoursesQueryDto extends IntersectionType(
  PaginationDto,
  CoursesFilterDto,
  CourseSortDto,
) {}
