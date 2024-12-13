import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Course } from 'course/entities/course.entity';
import { CategoryRepository } from 'category/category.repository';

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
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      event.entity['category'] = category;
      delete event.entity['categoryId'];
    }
  }
}
