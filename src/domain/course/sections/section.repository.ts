import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Section } from 'course/entities/section.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SectionsRepository extends AbstractRepository<Section> {
  protected readonly logger = new Logger(SectionsRepository.name);

  constructor(
    @InjectRepository(Section)
    sectionsRepository: Repository<Section>,
    entityManager: EntityManager,
  ) {
    super(sectionsRepository, entityManager);
  }
}
