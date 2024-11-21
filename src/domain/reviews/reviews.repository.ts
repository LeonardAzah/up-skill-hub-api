import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsRepository extends AbstractRepository<Review> {
  protected readonly logger = new Logger(ReviewsRepository.name);

  constructor(
    @InjectRepository(Review)
    reviewsRepository: Repository<Review>,
    entityManager: EntityManager,
  ) {
    super(reviewsRepository, entityManager);
  }
}
