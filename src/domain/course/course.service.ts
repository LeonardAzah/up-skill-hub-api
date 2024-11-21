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
  PaginationDto,
  PaginationService,
} from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';
import { MoreThanOrEqual } from 'typeorm';
import { RequestUser } from 'common/interfaces/request-user.interface';
import { compareUserId } from 'common/utils/authorization.util';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { CourseStatus } from './enums/status.enum';
import { CourseStatusDto } from './dto/status.dto';
import { User } from 'users/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(id: string, createCourseDto: CreateCourseDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    const course = new Course({ owner: user, ...createCourseDto });
    return this.courseRepository.create(course);
  }

  async findAll(coursesQueryDto: CoursesQueryDto) {
    const { page, course_level, lang, q, ratings, categoryId, sort, order } =
      coursesQueryDto;
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
        status: CourseStatus.PUBLISHED,
        title: this.filteringService.constains(q),
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

  async uploadThumbnail(id: string, thumbnail: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_COURSE');
    const course = await this.courseRepository.findOne({ where: { id } });
    const imageData = await this.cloudinaryService.uploadFile(
      thumbnail,
      folder,
    );
    course.thumbnailUrl = imageData.secure_url;
    return this.courseRepository.create(course);
  }

  async getEnrolledCourses(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['enrolledCourses', 'enrolledCourses.sections.lessons'],
    });

    return user.enrolledCourses;
  }

  async getOwnedCourses(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { ownedCourses: true },
    });

    return user.ownedCourses;
  }

  async enrollToCourse(id: string, user: User) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { enrolledStudents: true },
    });

    const isEnrolled = course.enrolledStudents.some(
      (student) => student.id === user.id,
    );
    if (isEnrolled) return;

    course.enrolledStudents.push(user);
    await this.courseRepository.create(course);
    const { enrolledStudents, ...courseWithoutStudents } = course;

    return courseWithoutStudents;
  }

  async updateStatus(id: string, { status }: CourseStatusDto) {
    return this.courseRepository.findOneAndUpdate({ id }, { status });
  }

  async submitForReview(id: string) {
    return this.courseRepository.findOneAndUpdate(
      { id },
      { status: CourseStatus.PENDING },
    );
  }

  async getPendingCourses(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = paginationDto.limit ?? DefaultPageSize.COURSE;
    const offset = this.paginationService.calculateOffset(limit, page);

    const courses = await this.courseRepository.find({
      where: { status: CourseStatus.PENDING },
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, courses.count);

    return { courses: courses.data, meta };
  }
}
