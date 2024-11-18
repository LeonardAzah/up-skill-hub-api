import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsRepository extends AbstractRepository<Cart> {
  protected readonly logger = new Logger(CartsRepository.name);

  constructor(
    @InjectRepository(Cart)
    cartsRepository: Repository<Cart>,
    entityManager: EntityManager,
  ) {
    super(cartsRepository, entityManager);
  }
}
