import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SectionsRepository } from './section.repository';
import { Section } from 'course/entities/section.entity';
import { CourseRepository } from 'course/course.repository';
import { UpdateSectionDto } from 'course/sections/dto/update-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { EntityManager, In } from 'typeorm';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly courseRepository: CourseRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async save(id: string, createSection: CreateSectionDto) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['sections'],
    });
    interface MaxIndexResult {
      maxIndex: number;
    }

    const maxIndexResult = await this.entityManager
      .getRepository('section')
      .createQueryBuilder('section')
      .select('COALESCE(MAX(section.index), 0)', 'maxIndex')
      .where('section."courseId" = :courseId', {
        courseId: course.id,
      })
      .getRawOne<MaxIndexResult>();

    const maxIndex = maxIndexResult.maxIndex;
    console.log(maxIndex);

    const nextIndex = maxIndex + 1;

    const section = new Section({
      index: nextIndex,
      courseId: id,
      course,
      ...createSection,
    });
    console.log(section);
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

  async reorderSections(
    courseId: string,
    section1Id: string,
    section2Id: string,
  ) {
    const sections = await this.sectionsRepository.findBy({
      id: In([section1Id, section2Id]),
      courseId,
    });

    if (sections.length !== 2) {
      throw new NotFoundException(
        'One or both sections not found for the given course',
      );
    }

    const [firstSection, secondSection] = sections;
    const tempIndex = firstSection.index;
    firstSection.index = secondSection.index;
    secondSection.index = tempIndex;

    await this.sectionsRepository.save(firstSection);
    await this.sectionsRepository.save(secondSection);
  }

  async remove(id: string) {
    const section = await this.sectionsRepository.findOne({
      where: { id },
    });

    return this.sectionsRepository.remove(section);
  }

  private async getNextSectionIndex(courseId: string) {
    const query = await this.sectionsRepository.createQueryBuilder('section');
    query.select('MAX(section.index)', 'index');
    query.where('section.courseId = :courseId', { courseId });
    const result = await query.getRawOne();

    console.log(result);

    const maxIndex = result?.index ?? 0;

    return maxIndex + 1;
  }
}
