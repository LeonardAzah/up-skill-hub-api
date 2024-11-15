import { IsEnum, IsString } from 'class-validator';
import { CourseStatus } from 'course/enums/status.enum';

export class CourseStatusDto {
  @IsEnum(CourseStatus)
  @IsString()
  status: CourseStatus;
}
