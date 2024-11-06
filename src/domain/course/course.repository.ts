import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from 'common';
import { Course } from './entities/course.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CourseRepository extends AbstractRepository<Course> {
  protected readonly logger = new Logger(CourseRepository.name);

  constructor(
    @InjectRepository(Course)
    courseRepository: Repository<Course>,
    entityManager: EntityManager,
  ) {
    super(courseRepository, entityManager);
  }
}
