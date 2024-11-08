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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { IdDto, PaginationDto } from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() { id }: RequestUser,
  ) {
    return this.courseService.create(id, createCourseDto);
  }

  @Get()
  findAll(@Query() coursesQueryDto: CoursesQueryDto) {
    return this.courseService.findAll(coursesQueryDto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: IdDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.courseService.remove(id);
  }
}
