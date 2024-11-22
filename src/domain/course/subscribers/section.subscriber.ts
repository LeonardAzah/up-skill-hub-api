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

@Injectable()
@EventSubscriber()
export class SectionsSubscriber implements EntitySubscriberInterface<Section> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly courseRepository: CourseRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Section;
  }

  async beforeInsert(event: InsertEvent<Section>) {
    await this.setCourse(event);
  }

  private async setCourse(event: InsertEvent<Section> | UpdateEvent<Section>) {
    const courseId = event.entity['courseId'];

    const course = await this.courseRepository.findOneById({
      where: { id: courseId },
    });
    event.entity['course'] = course;
    delete event.entity['courseId'];
  }
}
