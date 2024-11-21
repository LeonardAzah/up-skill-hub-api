import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { Review } from './entities/review.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { CourseRepository } from 'course/course.repository';
import {
  DefaultPageSize,
  FilteringService,
  PaginationDto,
  PaginationService,
} from 'common';
import { ReviewQueryDto } from './dto/review-query.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly coursesRepository: CourseRepository,
    private readonly paginationService: PaginationService,
    private readonly filteringService: FilteringService,
  ) {}
  async create(userId: string, createReviewDto: CreateReviewDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const { courseId, ...reviewData } = createReviewDto;

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });
    const review = new Review({ ...reviewData, user, course });
    return this.reviewsRepository.create(review);
  }

  async findAll(id: string, reviewQueryDto: ReviewQueryDto) {
    const { page, q } = reviewQueryDto;

    const limit = reviewQueryDto.limit ?? DefaultPageSize.REVIEW;
    const offset = this.paginationService.calculateOffset(limit, page);
    const course = await this.coursesRepository.findOne({ where: { id } });
    const result = await this.reviewsRepository.find({
      where: {
        course: { id: course.id },
        comment: this.filteringService.constains(q),
      },
      relations: ['user'],
      select: {
        id: true,
        rating: true,
        comment: true,
        user: {
          name: true,
        },
      },
      skip: offset,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, result.count);

    return { data: result.data, meta };
  }

  async findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
