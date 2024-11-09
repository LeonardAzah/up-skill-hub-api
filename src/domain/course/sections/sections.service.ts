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

  async create(createSectionDto: CreateSectionDto) {
    const section = new Section(createSectionDto);
    return this.sectionsRepository.create(section);
  }

  async find(courseId: string) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    return this.sectionsRepository.find({
      where: { course },
      relations: { lessons: true },
    });
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    return this.sectionsRepository.findOneAndUpdate({ id }, updateSectionDto);
  }

  async remove(id: string) {
    const section = await this.sectionsRepository.findOne({ where: { id } });
    return this.sectionsRepository.remove(section);
  }
}
