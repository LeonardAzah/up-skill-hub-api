import { IsIn, IsOptional } from 'class-validator';
import { OrderDto } from '../order.dto';

const Sort = [
  'most-reviewed',
  'most-relevant',
  'highest-rated',
  'newest',
] as const;
type Sort = (typeof Sort)[number];
export class CourseSortDto extends OrderDto {
  @IsOptional()
  @IsIn(Sort)
  readonly sort?: Sort = 'most-relevant';
}
