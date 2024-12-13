import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from 'common/Decorators/current-user.decorator';
import { IdDto, Public, RequestUser } from 'common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewQueryDto } from './dto/review-query.dto';
import { GetCourseReviewDto } from './dto/get-course.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  save(
    @CurrentUser() { id }: RequestUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.save(id, createReviewDto);
  }

  @Get()
  findOne(
    @CurrentUser() { id }: RequestUser,
    @Body() { courseId }: GetCourseReviewDto,
  ) {
    return this.reviewsService.findOne(id, courseId);
  }

  @Post('update')
  update(
    @CurrentUser() { id }: RequestUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.update(id, createReviewDto);
  }

  @Delete()
  remove(
    @CurrentUser() { id }: RequestUser,
    @Body() { courseId }: GetCourseReviewDto,
  ) {
    return this.reviewsService.remove(id, courseId);
  }

  @Public()
  @Get(':id')
  findAll(@Param() { id }: IdDto, @Query() reviewQueryDto: ReviewQueryDto) {
    return this.reviewsService.findAll(id, reviewQueryDto);
  }
}
