import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from 'auth/decorators/current-user.decorator';
import { RequestUser } from 'auth/interfaces/request-user.interface';
import { IdDto, PaginationDto } from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'cloudinary/files/utils/file-validation.util';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles/enums/roles.enum';
import { Public } from 'auth/decorators/public.decorator';
import { CourseStatus } from './enums/status.enum';
import { CourseStatusDto } from './dto/status.dto';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(Role.TEACHER)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() { id }: RequestUser,
  ) {
    return this.courseService.create(id, createCourseDto);
  }

  @Public()
  @Get()
  async findAll(@Query() coursesQueryDto: CoursesQueryDto) {
    return this.courseService.findAll(coursesQueryDto);
  }

  @Roles(Role.ADMIN)
  @Get('pending-courses')
  async getPendingCourses(@Query() paginationDto: PaginationDto) {
    return this.courseService.getPendingCourses(paginationDto);
  }

  @Roles(Role.STUDENT)
  @Get('learning')
  async getEnrolledCourses(@CurrentUser() { id }: RequestUser) {
    return this.courseService.getEnrolledCourses(id);
  }

  @Roles(Role.TEACHER)
  @Get('my-courses')
  async getOwnedCourses(@CurrentUser() { id }: RequestUser) {
    return this.courseService.getOwnedCourses(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Roles(Role.TEACHER)
  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Param() { id }: IdDto,
    @UploadedFile(createParseFilePipe('2MB', 'png', 'jpeg'))
    thumbnail: Express.Multer.File,
  ) {
    return this.courseService.uploadThumbnail(id, thumbnail);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateCourseStatus(
    @Param() { id }: IdDto,
    @Body() status: CourseStatusDto,
  ) {
    return this.courseService.updateStatus(id, status);
  }

  @Roles(Role.TEACHER)
  @Patch(':id/review')
  async submitForReview(@Param() { id }: IdDto) {
    return this.courseService.submitForReview(id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.courseService.findOne(id);
  }

  @Roles(Role.TEACHER)
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @Roles(Role.TEACHER)
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.courseService.remove(id);
  }
}
