import { Injectable } from '@nestjs/common';
import { SectionsRepository } from './section.repository';
import { CreateSectionDto } from 'course/dto/create-section.dto';
import { CourseRepository } from 'course/course.repository';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly couresesRepository: CourseRepository,
  ) {}

  async create(createSectionDto: CreateSectionDto) {}
}
