import { IsOptional } from 'class-validator';
import { IsBoolean } from '../decorators/validators/is-boolean.decorator';

export class RemoveDto {
  @IsOptional()
  @IsBoolean()
  readonly soft?: boolean;
}
