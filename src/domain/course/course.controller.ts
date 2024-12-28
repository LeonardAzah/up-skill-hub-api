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
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from 'common/Decorators/current-user.decorator';
import { RequestUser } from 'common/interfaces/request-user.interface';
import { IdDto, PaginationDto, Roles } from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createContentParseFilePipe,
  createParseFilePipe,
} from 'cloudinary/files/utils/file-validation.util';
import { Role } from 'common/enums/roles.enum';
import { Public } from 'common/Decorators/public.decorator';
import { CourseStatusDto } from './dto/status.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { multerOptions } from 'cloudinary/config/multer.config';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(Role.INSTRUCTOR)
  @Post()
  async save(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() { id }: RequestUser,
  ) {
    return this.courseService.save(id, createCourseDto);
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

  @Roles(Role.INSTRUCTOR)
  @Get('my-courses')
  async getOwnedCourses(@CurrentUser() { id }: RequestUser) {
    return this.courseService.getOwnedCourses(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Roles(Role.INSTRUCTOR)
  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Param() { id }: IdDto,
    @UploadedFile(createParseFilePipe('2MB', 'png', 'jpeg'))
    thumbnail: Express.Multer.File,
  ) {
    return this.courseService.uploadThumbnail(id, thumbnail);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Roles(Role.INSTRUCTOR)
  @Post('promotional-video/:id')
  @UseInterceptors(FileInterceptor('content', multerOptions))
  async uploadPromotionalVideo(
    @Param() { id }: IdDto,
    @UploadedFile(
      createContentParseFilePipe(
        '500MB',
        'mkv',
        'mov',
        'wmv',
        'flv',
        'avi',
        'webm',
        'mp4',
      ),
    )
    content: Express.Multer.File,
  ) {
    return this.courseService.uploadPromotionalVideo(id, content);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  async updateCourseStatus(
    @Param() { id }: IdDto,
    @Body() status: CourseStatusDto,
  ) {
    return this.courseService.updateStatus(id, status);
  }

  @Roles(Role.INSTRUCTOR)
  @Patch(':id/review')
  async submitForReview(@Param() { id }: IdDto) {
    return this.courseService.submitForReview(id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.courseService.findOne(id);
  }

  @Roles(Role.INSTRUCTOR)
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @Roles(Role.INSTRUCTOR)
  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.courseService.remove(id);
  }
}
