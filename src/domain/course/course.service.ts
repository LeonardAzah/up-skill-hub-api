import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './course.repository';
import { Course } from './entities/course.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { CategoryRepository } from 'category/category.repository';
import {
  DefaultPageSize,
  FilteringService,
  OrderDto,
  PaginationDto,
  PaginationService,
} from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';
import { ILike, MoreThanOrEqual } from 'typeorm';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { compareUserId } from 'common/utils/authorization.util';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
  ) {}
  async create(id: string, createCourseDto: CreateCourseDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    const course = new Course({ owner: user, ...createCourseDto });
    return this.courseRepository.create(course);
  }

  async findAll(coursesQueryDto: CoursesQueryDto) {
    const {
      page,
      duration,
      features,
      course_level,
      lang,
      price,
      q,
      ratings,
      categoryId,
      sort,
      order,
    } = coursesQueryDto;
    const limit = coursesQueryDto.limit ?? DefaultPageSize.COURSE;
    const offset = this.paginationService.calculateOffset(limit, page);
    let category;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
    }

    const result = await this.courseRepository.find({
      where: {
        title: this.filteringService.constains(q),
        duration,
        // features,
        course_level,
        language: lang,
        ratings: ratings ? MoreThanOrEqual(ratings) : undefined,
        category,
      },
      // order: { [sort]: order },
      skip: offset,
      take: limit,
    });
    const meta = this.paginationService.createMeta(limit, page, result.count);
    return { data: result.data, meta };
  }

  async findOne(id: string) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['sections', 'sections.lessons'],
    });
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    currentUser: RequestUser,
  ) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    await compareUserId(currentUser, course.owner.id);

    return this.courseRepository.findOneAndUpdate({ id }, updateCourseDto);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id } });
    return this.courseRepository.remove(course);
  }
}
