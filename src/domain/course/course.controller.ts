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
import { IdDto } from 'common';
import { CoursesQueryDto } from './dto/course-query.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { createParseFilePipe } from 'cloudinary/files/utils/file-validation.util';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() { id }: RequestUser,
  ) {
    return this.courseService.create(id, createCourseDto);
  }

  @Get()
  async findAll(@Query() coursesQueryDto: CoursesQueryDto) {
    return this.courseService.findAll(coursesQueryDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Post('thumbnail/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Param() { id }: IdDto,
    @UploadedFile(createParseFilePipe('2MB', 'png', 'jpeg'))
    thumbnail: Express.Multer.File,
  ) {
    return this.courseService.uploadThumbnail(id, thumbnail);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.courseService.update(id, updateCourseDto, user);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.courseService.remove(id);
  }
}
