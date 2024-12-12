import { BadRequestException, Injectable } from '@nestjs/common';
import { SectionsRepository } from './section.repository';
import { Section } from 'course/entities/section.entity';
import { CourseRepository } from 'course/course.repository';
import { UpdateSectionDto } from 'course/sections/dto/update-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async save(id: string, createSection: CreateSectionDto) {
    const course = await this.courseRepository.findOne({ where: { id } });

    const nextIndex = await this.getNextSectionIndex(id);

    const section = new Section({ index: nextIndex, course, ...createSection });
    return this.sectionsRepository.save(section);
  }

  async find(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['sections'],
      order: { sections: { index: 'ASC' } },
    });

    return course.sections;
  }

  async upadte(updateSection: UpdateSectionDto) {
    const { sectionId, ...section } = updateSection;
    return this.sectionsRepository.findOneAndUpdate({ id: sectionId }, section);
  }

  async reorderSections(courseId: string, newOrder: string[]) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['sections'],
    });
    const sectionsIds = course.sections.map((section) => section.id);
    if (
      new Set(newOrder).size !== sectionsIds.length ||
      !newOrder.every((id) => sectionsIds.includes(id))
    ) {
      throw new BadRequestException('Invalid section order');
    }

    await Promise.all(
      newOrder.map((sectionId, index) =>
        this.sectionsRepository.findOneAndUpdate(
          { id: sectionId },
          { index: index + 1 },
        ),
      ),
    );
  }

  async remove(id: string) {
    const section = await this.sectionsRepository.findOne({
      where: { id },
    });

    return this.sectionsRepository.remove(section);
  }

  private async getNextSectionIndex(courseId: string) {
    const lastSection = await this.sectionsRepository.findOne({
      where: { course: { id: courseId } },
      order: { index: 'DESC' },
    });

    return lastSection ? lastSection.index + 1 : 1;
  }
}
