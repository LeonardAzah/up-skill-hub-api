import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { NameFilterDto } from '../name-filter.dto';
import { Type } from 'class-transformer';
import {
  CourseLevel,
  Duration,
  Features,
  Language,
  Price,
} from 'common/enums/course-filter.enums';

export class CoursesFilterDto extends NameFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratings?: number;

  @IsOptional()
  @IsEnum(Language)
  lang?: Language;

  @IsOptional()
  @IsEnum(Duration)
  duration?: Duration;

  @IsOptional()
  @IsArray()
  @IsEnum(Features, { each: true })
  @Type(() => String)
  features?: Features[];

  @IsOptional()
  @IsEnum(CourseLevel)
  course_level?: CourseLevel;

  @IsOptional()
  @IsEnum(Price)
  price?: Price;
}
