import { AbstractEntity } from './abstract.entity';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderDto } from 'common/querying';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;
  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async save(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.entityRepository.findOne(options);
    if (!entity) {
      this.logger.warn('Entity was not found with where', options);
      throw new NotFoundException('Entity was not found');
    }
    return entity;
  }
  async findBy(options: FindOptionsWhere<T>): Promise<T[]> {
    return this.entityRepository.findBy(options);
  }
  async findOneOrCreate(
    options: FindOneOptions<T>,
    factory: () => T,
  ): Promise<T> {
    let entity = await this.entityRepository.findOne(options);
    if (!entity) {
      this.logger.log('Entity not found, creating a new one');
      entity = factory();
      await this.save(entity);
    }
    return entity;
  }

  async findByEmail(where: FindOptionsWhere<T>): Promise<T> {
    return this.entityRepository.findOne({ where });
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partilEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partilEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity was not found with filterQuery', where);
      throw new NotFoundException('Entity was not found');
    }
    return this.findOne({ where });
  }

  async find(options?: FindManyOptions<T>) {
    const [data, count] = await this.entityRepository.findAndCount(options);
    return { data, count };
  }

  async createQueryBuilder(
    alias: string,
    options?: {
      where?: string;
      parameters?: Record<string, any>;
      orderBy?: Record<string, Order>;
      relations?: string[];
    },
  ) {
    try {
      const queryBuilder = await this.entityManager.createQueryBuilder<T>(
        this.entityRepository.target,
        alias,
      );

      // Add WHERE clause if provided
      if (options?.where) {
        queryBuilder.where(options.where, options.parameters);
      }

      // Add ORDER BY clause if provided
      if (options?.orderBy) {
        Object.entries(options.orderBy).forEach(([column, direction]) => {
          queryBuilder.addOrderBy(`${alias}.${column}`, direction);
        });
      }

      // Add RELATIONS if provided
      if (options?.relations) {
        options.relations.forEach((relation) => {
          queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
        });
      }

      return queryBuilder;
    } catch (error) {
      throw new InternalServerErrorException('Error creating query builder');
    }
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }

  async softRemove(where: T) {
    await this.entityRepository.softRemove(where);
  }
  async remove(where: T) {
    await this.entityRepository.remove(where);
  }
  async recover(where: T) {
    await this.entityRepository.recover(where);
  }

  async existsBy(where: FindOptionsWhere<T>) {
    return this.entityRepository.existsBy(where);
  }

  async delete(where: FindOptionsWhere<T>) {
    await this.entityRepository.delete(where);
  }
  async deleteBy(where: FindOptionsWhere<T>): Promise<void> {
    await this.entityRepository.delete(where);
  }
}
