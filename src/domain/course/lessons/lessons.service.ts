import { Injectable } from '@nestjs/common';
import { LessonsRepository } from './lesson.repository';
import { SectionsRepository } from 'course/sections/section.repository';
import { Lesson } from 'course/entities/lesson.entity';
import { UpdateLessonDto } from 'course/lessons/dto/update-lesson.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly sectionsRepository: SectionsRepository,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async save(createLessonDto: CreateLessonDto) {
    const section = await this.sectionsRepository.findOneById({
      where: { id: createLessonDto.sectionId },
    });

    const { sectionId, ...lessonsData } = createLessonDto;
    const lesson = new Lesson({ section, ...lessonsData });
    await this.lessonsRepository.save(lesson);
    return this.sectionsRepository.findOneById({
      where: { id: section.id },
    });
  }

  async update(updateLessonDto: UpdateLessonDto) {
    const { lessonId, ...updateDate } = updateLessonDto;

    return this.lessonsRepository.findOneAndUpdate(
      { id: lessonId },
      updateDate,
    );
  }

  async remove(id: string) {
    const lesson = await this.lessonsRepository.findOneById({ where: { id } });
    return this.lessonsRepository.remove(lesson);
  }

  async uploadContent(id: string, content: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_COURSE');

    const lesson = await this.lessonsRepository.findOneById({
      where: { id },
    });

    console.log('Content', content.path);
    const contentData = await this.cloudinaryService.uploadVideo(
      content,
      folder,
    );

    lesson.contentUrl = contentData.secure_url;
    lesson.lessonType = contentData.resource_type;

    await this.lessonsRepository.save(lesson);
    return contentData.secure_url;
  }
}
