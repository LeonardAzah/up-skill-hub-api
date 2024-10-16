import { AbstractEntity } from './abstract.entity';
import { Logger, NotFoundException } from '@nestjs/common';
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

  async create(entity: T): Promise<T> {
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
}
