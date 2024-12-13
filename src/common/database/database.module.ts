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
        type: 'postgres',
        host: configService.get('DATASOURCE_HOST'),
        port: configService.get('DATASOURCE_PORT'),
        database: configService.get('DATASOURCE_DATABASE'),
        username: configService.get('DATASOURCE_USERNAME'),
        password: configService.get('DATASOURCE_PASSWORD'),
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
