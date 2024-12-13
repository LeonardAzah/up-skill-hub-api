import { IsIn, IsOptional, IsString } from 'class-validator';

const Order = ['ASC', 'DESC'] as const;
export type Order = (typeof Order)[number];
export class OrderDto {
  @IsOptional()
  @IsIn(Order)
  readonly order?: Order = 'ASC';
}
