import { Injectable } from '@nestjs/common';
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CourseEmitterPayload } from './interfaces/course-emitter-payload.interfaces';
import { CreateCourseDto } from './dto/create-course.dto';

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
    private eventEmitter: EventEmitter2,
  ) {}
  async save(id: string, createCourseDto: CreateCourseDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    const course = new Course({ owner: user, ...createCourseDto });

    const payload: CourseEmitterPayload = {
      token: user?.fcmToken,
      courseTitle: course.title,
    };

    this.eventEmitter.emitAsync('course.created', payload);

    return this.courseRepository.save(course);
  }

  async findAll(coursesQueryDto: CoursesQueryDto) {
    const { page, course_level, lang, q, ratings, categoryId } =
      coursesQueryDto;
    const limit = coursesQueryDto.limit ?? DefaultPageSize.COURSE;
    const offset = this.paginationService.calculateOffset(limit, page);
    let category;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
    }

    const query = await this.courseRepository.createQueryBuilder('course');

    query.leftJoin('course.reviews', 'review');
    query.addSelect('AVG(review.ratings)', 'averageRating');
    query.where('course.status = :status', { status: CourseStatus.PUBLISHED });
    query.andWhere('course.title LIKE :title', { title: `%${q || ''}%` });
    query.andWhere(course_level ? 'course.courseLevel = :courseLevel' : '1=1', {
      courseLevel: course_level,
    });
    query.andWhere(lang ? 'course.language = :language' : '1=1', {
      language: lang,
    });
    query.andWhere(category ? 'course.category = :category' : '1=1', {
      category,
    });
    query.having(ratings ? 'AVG(review.ratings) >= :ratings' : '1=1', {
      ratings,
    });
    query.groupBy('course.id');
    query.offset(offset).limit(limit);

    console.log(query);
    const [data, count] = await query.getManyAndCount();

    const meta = this.paginationService.createMeta(limit, page, count);
    return { data, meta };
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

    const payload: CourseEmitterPayload = {
      token: course.owner?.fcmToken,
      courseTitle: course.title,
    };

    this.eventEmitter.emitAsync('course.removed', payload);

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
    await this.courseRepository.save(course);

    const payload: CourseEmitterPayload = {
      token: course.owner?.fcmToken,
      courseTitle: course.title,
    };

    this.eventEmitter.emitAsync('course.thumbnail.updated', payload);
    return course;
  }

  async uploadPromotionalVideo(id: string, content: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_COURSE');
    const course = await this.courseRepository.findOne({ where: { id } });
    const result = await this.cloudinaryService.uploadVideo(content, folder);

    course.promoVideoUrl = result.secure_url;

    await this.courseRepository.save(course);
    return { url: result.secure_url };
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
    await this.courseRepository.save(course);

    const payloadToInstrctors: CourseEmitterPayload = {
      token: course.owner?.fcmToken,
      courseTitle: course.title,
      name: user.name,
    };

    const payloadToStudent: CourseEmitterPayload = {
      token: user?.fcmToken,
      courseTitle: course.title,
    };

    this.eventEmitter.emitAsync('student.enrolled', payloadToInstrctors);

    this.eventEmitter.emitAsync('course.enrolled', payloadToStudent);

    const { enrolledStudents, ...courseWithoutStudents } = course;

    return courseWithoutStudents;
  }

  async updateStatus(id: string, { status }: CourseStatusDto) {
    const course = await this.courseRepository.findOneAndUpdate(
      { id },
      { status },
    );
    const payload: CourseEmitterPayload = {
      token: course.owner?.fcmToken,
      courseTitle: course.title,
    };

    this.eventEmitter.emitAsync('course.status.updated', payload);
    return course;
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
