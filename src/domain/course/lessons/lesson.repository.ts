import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Lesson } from 'course/entities/lesson.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LessonsRepository extends AbstractRepository<Lesson> {
  protected readonly logger = new Logger(LessonsRepository.name);

  constructor(
    @InjectRepository(Lesson)
    lessonsRepository: Repository<Lesson>,
    entityManager: EntityManager,
  ) {
    super(lessonsRepository, entityManager);
  }
}
