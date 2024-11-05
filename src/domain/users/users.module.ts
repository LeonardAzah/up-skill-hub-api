import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.reposisoty';
import { DatabaseModule, QueryingModule } from 'common';
import { User } from './entities/user.entity';
import { CommonModule } from 'common/common.module';
import { UsersSubscriber } from './subscribers/users.subscribers';
import { Category } from 'category/entities/category.entity';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    CommonModule,
    DatabaseModule.forFeature([User, Category]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersSubscriber],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
