import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const DefaultPageSize = {
  USER: 10,
} as const satisfies Record<string, number>;

export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE_NUMBER = 25;
