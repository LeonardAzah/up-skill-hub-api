import { IsUUID } from 'class-validator';

export class GetCourseReviewDto {
  @IsUUID()
  courseId: string;
}
