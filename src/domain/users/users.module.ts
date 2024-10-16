import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.reposisoty';
import { DatabaseModule, QueryingModule } from 'common';
import { User } from './entities/user.entity';
import { CommonModule } from 'common/common.module';

@Module({
  imports: [
    QueryingModule,
    DatabaseModule,
    CommonModule,
    DatabaseModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
