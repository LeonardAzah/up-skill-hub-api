import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NameFilterDto } from '../name-filter.dto';
import { Type } from 'class-transformer';
import { CourseLevel, Language } from 'common/enums/course-filter.enums';

export class CoursesFilterDto extends NameFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratings?: number;

  @IsOptional()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsEnum(Language)
  lang?: Language;

  @IsOptional()
  @IsEnum(CourseLevel)
  course_level?: CourseLevel;
}
