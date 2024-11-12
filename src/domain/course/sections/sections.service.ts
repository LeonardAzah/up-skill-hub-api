import { Injectable } from '@nestjs/common';
import { SectionsRepository } from './section.repository';
import { CreateSectionDto } from 'course/dto/create-section.dto';
import { Section } from 'course/entities/section.entity';
import { CourseRepository } from 'course/course.repository';
import { UpdateSectionDto } from 'course/dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async create(id: string, createSection: CreateSectionDto) {
    const course = await this.courseRepository.findOne({ where: { id } });

    const section = new Section({ course, ...createSection });
    return this.sectionsRepository.create(section);
  }

  async find(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });
    return course.sections;
  }

  async upadte(id: string, updateSection: UpdateSectionDto) {
    return this.sectionsRepository.findOneAndUpdate({ id }, updateSection);
  }

  async remove(id: string) {
    const section = await this.sectionsRepository.findOne({ where: { id } });

    return this.sectionsRepository.remove(section);
  }
}
