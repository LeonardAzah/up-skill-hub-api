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

@Injectable()
@EventSubscriber()
export class CourseSubscriber implements EntitySubscriberInterface<Course> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly categoryRepository: CategoryRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Course;
  }

  async beforeInsert(event: InsertEvent<Course>) {
    await this.setCategoryIfExists(event);
  }

  async beforeUpdate(event: UpdateEvent<Course>) {
    await this.setCategoryIfExists(event);
  }

  private async setCategoryIfExists(
    event: InsertEvent<Course> | UpdateEvent<Course>,
  ) {
    const categoryId = event.entity['categoryId'];

    if (categoryId) {
      const category = await this.categoryRepository.findOneById({
        where: { id: categoryId },
      });
      event.entity['category'] = category;
      delete event.entity['categoryId'];
    }
  }
}
