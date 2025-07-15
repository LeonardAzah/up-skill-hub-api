import { IsOptional } from 'class-validator';
import { IsBoolean } from 'common/Decorators';

export class RemoveDto {
  @IsOptional()
  @IsBoolean()
  readonly soft?: boolean;
}
