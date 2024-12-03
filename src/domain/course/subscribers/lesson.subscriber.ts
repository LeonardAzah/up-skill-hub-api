import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
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

    const course = await this.sectionsRepository.findOneById({
      where: { id: sectionId },
    });
    event.entity['course'] = course;
    delete event.entity['sectionId'];
  }
}
