import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { Review } from './entities/review.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { CourseRepository } from 'course/course.repository';
import { DefaultPageSize, FilteringService, PaginationService } from 'common';
import { ReviewQueryDto } from './dto/review-query.dto';
import { LessThan, MoreThanOrEqual } from 'typeorm';
import { ReviewEmitterPayload } from './interfaces/review-emitter-payload.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly coursesRepository: CourseRepository,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
    private eventEmitter: EventEmitter2,
  ) {}
  async save(userId: string, createReviewDto: CreateReviewDto) {
    const user = await this.usersRepository.findOneById({
      where: { id: userId },
    });

    const { courseId, ...reviewData } = createReviewDto;

    const course = await this.coursesRepository.findOneById({
      where: { id: courseId },
      relations: { enrolledStudents: true },
    });

    const isStudentEnrolled = course.enrolledStudents.some(
      (std) => std.id === user.id,
    );
    if (!isStudentEnrolled) {
      throw new ForbiddenException('User not enrolled to course');
    }

    const review = new Review({ ...reviewData, user, course });

    await this.reviewsRepository.save(review);

    const payload: ReviewEmitterPayload = {
      name: user.name,
      courseTitle: course.title,
      token: course.owner.fcmToken,
      ratings: review.ratings,
    };

    this.eventEmitter.emitAsync('student.reviewed', payload);

    return review;
  }

  async findAll(id: string, reviewQueryDto: ReviewQueryDto) {
    const { page, q, ratings } = reviewQueryDto;

    const limit = reviewQueryDto.limit ?? DefaultPageSize.REVIEW;
    const offset = this.paginationService.calculateOffset(limit, page);

    const result = await this.reviewsRepository.find({
      where: {
        course: { id },
        comment: this.filteringService.constains(q),
        ratings: ratings
          ? MoreThanOrEqual(ratings) && LessThan(ratings + 1)
          : undefined,
      },
      relations: ['user'],
      select: {
        id: true,
        ratings: true,
        comment: true,
        user: {
          name: true,
          profile: true,
        },
      },
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, result.count);

    return { data: result.data, meta };
  }

  async findOneById(id: string, courseId: string) {
    return this.reviewsRepository.findOneById({
      where: {
        course: { id: courseId },
        user: { id },
      },
    });
  }

  async update(id: string, createReviewDto: CreateReviewDto) {
    const { courseId, ratings, comment } = createReviewDto;

    const review = await this.reviewsRepository.findOneById({
      where: {
        course: { id: courseId },
        user: { id },
      },
    });

    review.ratings = ratings;
    review.comment = comment;

    const payload: ReviewEmitterPayload = {
      name: review.user.name,
      courseTitle: review.course.title,
      token: review.course.owner.fcmToken,
      ratings: review.ratings,
    };

    this.eventEmitter.emitAsync('student.reviewed.updated', payload);
    return this.reviewsRepository.save(review);
  }

  async remove(id: string, courseId: string) {
    const review = await this.reviewsRepository.findOneById({
      where: {
        course: { id: courseId },
        user: { id },
      },
    });
    return this.reviewsRepository.remove(review);
  }
}
