import { Injectable } from '@nestjs/common';
import { SectionsRepository } from './section.repository';
import { CourseRepository } from 'course/course.repository';
import { Section } from 'course/entities/section.entity';
import { UpdateSectionDto } from 'course/sections/dto/update-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async save(id: string, createSection: CreateSectionDto) {
    const course = await this.courseRepository.findOneById({ where: { id } });

    const section = new Section({ course, ...createSection });
    return this.sectionsRepository.save(section);
  }

  async upadte(id: string, updateSection: UpdateSectionDto) {
    return this.sectionsRepository.findOneAndUpdate({ id }, updateSection);
  }

  async remove(id: string) {
    const section = await this.sectionsRepository.findOneById({
      where: { id },
    });

    return this.sectionsRepository.remove(section);
  }
}
