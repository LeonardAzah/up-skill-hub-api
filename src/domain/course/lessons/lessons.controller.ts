import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from 'course/lessons/dto/create-lesson.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createContentParseFilePipe } from 'cloudinary/files/utils/file-validation.util';
import { IdDto } from 'common';
import { UploadContentDto } from 'course/lessons/dto/upload-content.dto';
import { multerOptions } from 'cloudinary/config/multer.config';
import { UpdateLessonDto } from 'course/lessons/dto/update-lesson.dto';
import { RemoveLessonDto } from './dto/remove-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Post('content')
  @UseInterceptors(FileInterceptor('content', multerOptions))
  async uploadContent(
    @Body() { lessonId }: UploadContentDto,
    @UploadedFile(
      createContentParseFilePipe(
        '300MB',
        'pdf',
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

  @Patch()
  async update(@Body() updateLessonDto: UpdateLessonDto) {
    this.lessonsService.update(updateLessonDto);
  }

  @Delete()
  async remove(@Body() { id }: RemoveLessonDto) {
    return this.lessonsService.remove(id);
  }
}
