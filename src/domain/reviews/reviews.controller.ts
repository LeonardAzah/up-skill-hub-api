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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'common/Decorators/current-user.decorator';
import { IdDto, PaginationDto, RequestUser } from 'common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewQueryDto } from './dto/review-query.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @CurrentUser() { id }: RequestUser,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(id, createReviewDto);
  }

  @Get(':id')
  findAll(@Param() { id }: IdDto, @Query() reviewQueryDto: ReviewQueryDto) {
    return this.reviewsService.findAll(id, reviewQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
