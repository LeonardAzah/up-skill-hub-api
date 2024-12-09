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
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createContentParseFilePipe } from 'cloudinary/files/utils/file-validation.util';
import { IdDto, Role, Roles } from 'common';
import { UploadContentDto } from 'course/lessons/dto/upload-content.dto';
import { multerOptions } from 'cloudinary/config/multer.config';
import { UpdateLessonDto } from 'course/lessons/dto/update-lesson.dto';
import { RemoveLessonDto } from './dto/remove-lesson.dto';
import { FileSchema } from 'cloudinary/files/swagger/schemas/file.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(Role.INSTRUCTOR)
  @Post()
  async save(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.save(createLessonDto);
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

  @Roles(Role.INSTRUCTOR)
  @Patch()
  async update(@Body() updateLessonDto: UpdateLessonDto) {
    this.lessonsService.update(updateLessonDto);
  }

  @Roles(Role.INSTRUCTOR)
  @Delete()
  async remove(@Body() { id }: RemoveLessonDto) {
    return this.lessonsService.remove(id);
  }
}
