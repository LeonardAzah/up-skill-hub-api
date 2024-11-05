import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectRepository(Category)
    categoryRepository: Repository<Category>,
    entityManager: EntityManager,
  ) {
    super(categoryRepository, entityManager);
  }
}
