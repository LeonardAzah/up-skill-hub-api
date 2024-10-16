import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ConfigModule } from 'common/config';
import { DatabaseExceptionFilter } from './exception-filter/database-exception/database-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DATASOURCE_HOST'),
        port: configService.getOrThrow('DATASOURCE_PORT'),
        database: configService.getOrThrow('DATASOURCE_DATABASE'),
        username: configService.getOrThrow('DATASOURCE_USERNAME'),
        password: configService.getOrThrow('DATASOURCE_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [{ provide: APP_FILTER, useClass: DatabaseExceptionFilter }],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
