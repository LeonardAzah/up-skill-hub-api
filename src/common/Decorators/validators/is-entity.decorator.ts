import { applyDecorators } from '@nestjs/common';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto } from '../../dto/id.dto';

/**
 * Checks if the value is an object with only a serial id.
 *
 */
export const IsEntity = (): PropertyDecorator =>
  applyDecorators(
    ValidateNested(),
    Type(() => IdDto),
  );
