import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.reposisoty';
import { DatabaseModule, QueryingModule } from 'common';
import { User } from './entities/user.entity';

@Module({
  imports: [QueryingModule, DatabaseModule, DatabaseModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
