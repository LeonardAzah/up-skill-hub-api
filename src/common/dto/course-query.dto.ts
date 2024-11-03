import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDto } from 'common/querying';
import { CourseFilterDto } from './course-filter.dto';
import { CourseSortDto } from './course-sort.dto';

export class CourseQueryDto extends IntersectionType(
  PaginationDto,
  CourseFilterDto,
  CourseSortDto,
) {}
