import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';

import * as joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: joi.object({
        DATASOURCE_USERNAME: joi.string().required(),
        DATASOURCE_PASSWORD: joi.string().required(),
        DATASOURCE_HOST: joi.string().required(),
        DATASOURCE_PORT: joi.string().required(),
        DATASOURCE_DATABASE: joi.string().required(),
        MYSQL_SYNCHRONIZE: joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
