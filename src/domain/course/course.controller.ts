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
import { PaginationDto } from 'common';

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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.courseService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
