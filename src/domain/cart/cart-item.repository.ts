import { Injectable, Logger } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemsRepository extends AbstractRepository<CartItem> {
  protected readonly logger = new Logger(CartItemsRepository.name);

  constructor(
    @InjectRepository(CartItem)
    cartItemsRepository: Repository<CartItem>,
    entityManager: EntityManager,
  ) {
    super(cartItemsRepository, entityManager);
  }
}
