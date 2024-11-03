import { applyDecorators } from '@nestjs/common';
import { IsInt, IsPositive, ValidationOptions } from 'class-validator';

/**
 * Checks if the value is a positive number greater than zero.
 * Checks if value is an integer.
 */

export const IsCardinal = (
  validationOptions?: ValidationOptions,
): PropertyDecorator =>
  applyDecorators(IsInt(validationOptions), IsPositive(validationOptions));
