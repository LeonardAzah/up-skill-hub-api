import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  comment: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => Math.round(value * 10) / 10)
  rating: number;

  @IsUUID()
  courseId: string;
}
