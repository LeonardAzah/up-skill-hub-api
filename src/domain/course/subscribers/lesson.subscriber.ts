import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from 'course/entities/course.entity';
import { CategoryRepository } from 'category/category.repository';
import { Category } from 'category/entities/category.entity';
import { BeforeQueryEvent } from 'typeorm/subscriber/event/QueryEvent';
import { Section } from 'course/entities/section.entity';
import { CourseRepository } from 'course/course.repository';
import { Lesson } from 'course/entities/lesson.entity';
import { SectionsRepository } from 'course/sections/section.repository';

@Injectable()
@EventSubscriber()
export class LessonsSubscriber implements EntitySubscriberInterface<Lesson> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sectionsRepository: SectionsRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Lesson;
  }

  async beforeInsert(event: InsertEvent<Lesson>) {
    await this.setSection(event);
  }

  private async setSection(event: InsertEvent<Lesson> | UpdateEvent<Lesson>) {
    const sectionId = event.entity['sectionId'];

    const course = await this.sectionsRepository.findOne({
      where: { id: sectionId },
    });
    event.entity['course'] = course;
    delete event.entity['sectionId'];
  }
}
