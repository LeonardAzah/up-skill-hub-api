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
        JWT_SECRET: joi.string().required(),
        PORT: joi.number().required(),
        JWT_EXPIRATION: joi.number().required(),
        REFRESH_TOKEN_PRIVATE_KEY: joi.string().required(),
        REFRESH_JWT_EXPIRATION: joi.number().required(),
        GOOGLE_CLIENT_ID: joi.string().required(),
        GOOGLE_CLIENT_SECRET: joi.string().required(),
        GOOGLE__OAUTH_REDIRECT_URL: joi.string().required(),
        CLOUDINARY_NAME: joi.string().required(),
        CLOUDINARY_API_SECRET: joi.string().required(),
        CLOUDINARY_API_KEY: joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
