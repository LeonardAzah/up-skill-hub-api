import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  createContentParseFilePipe,
  createParseFilePipe,
} from 'cloudinary/files/utils/file-validation.util';
import { IdDto, Role, Roles } from 'common';
import { UploadContentDto } from 'course/lessons/dto/upload-content.dto';
import { multerOptions } from 'cloudinary/config/multer.config';
import { UpdateLessonDto } from 'course/lessons/dto/update-lesson.dto';
import { RemoveLessonDto } from './dto/remove-lesson.dto';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { StreamLessonDto } from './dto/stream-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(Role.INSTRUCTOR)
  @Post()
  async save(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.save(createLessonDto);
  }

  @Get('stream')
  async streamVideo(@Body() { publicId }: StreamLessonDto) {
    return this.lessonsService.streamVideoContent(publicId);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Roles(Role.INSTRUCTOR)
  @Post('content')
  @UseInterceptors(FileInterceptor('content', multerOptions))
  async uploadContent(
    @Body() { lessonId }: UploadContentDto,
    @UploadedFile(
      createContentParseFilePipe(
        '300MB',
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
    return this.lessonsService.uploadContent(lessonId, content);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileSchema })
  @Patch('pdf-content')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdfAndHtmlContnet(
    @Body() { lessonId }: UploadContentDto,
    @UploadedFile(createParseFilePipe('2MB', 'pdf', 'html'))
    file: Express.Multer.File,
  ) {
    return this.lessonsService.uploadPdfAndHtmlContnet(lessonId, file);
  }

  @Roles(Role.INSTRUCTOR)
  @Patch()
  async update(@Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(updateLessonDto);
  }

  @Roles(Role.INSTRUCTOR)
  @Delete()
  async remove(@Body() { id }: RemoveLessonDto) {
    await this.lessonsService.remove(id);
    return { msg: 'lesson removed successfully' };
  }
}
