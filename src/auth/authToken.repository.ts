import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { AuthRefreshToken } from 'auth/entities/auth-refresh-token.entity';

@Injectable()
export class AuthTokensRepository extends AbstractRepository<AuthRefreshToken> {
  protected readonly logger = new Logger(AuthTokensRepository.name);

  constructor(
    @InjectRepository(AuthRefreshToken)
    usersRepository: Repository<AuthRefreshToken>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }
}
