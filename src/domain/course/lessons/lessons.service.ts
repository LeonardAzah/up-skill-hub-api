import { Injectable } from '@nestjs/common';
import { LessonsRepository } from './lesson.repository';
import { SectionsRepository } from 'course/sections/section.repository';
import { Lesson } from 'course/entities/lesson.entity';
import { UpdateLessonDto } from 'course/lessons/dto/update-lesson.dto';
import { CloudinaryService } from 'cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly sectionsRepository: SectionsRepository,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly entityManager: EntityManager,
  ) {}

  async save(createLessonDto: CreateLessonDto) {
    const section = await this.sectionsRepository.findOne({
      where: { id: createLessonDto.sectionId },
    });

    interface MaxIndexResult {
      maxIndex: number;
    }

    const maxIndexResult = await this.entityManager
      .getRepository('lesson')
      .createQueryBuilder('lesson')
      .select('COALESCE(MAX(lesson.index), 0)', 'maxIndex')
      .where('lesson.sectionId = :sectionId', {
        sectionId: createLessonDto.sectionId,
      })
      .getRawOne<MaxIndexResult>();

    const maxIndex = maxIndexResult.maxIndex;

    const nextIndex = maxIndex + 1;

    const { sectionId, ...lessonsData } = createLessonDto;
    const lesson = new Lesson({ section, index: nextIndex, ...lessonsData });
    await this.lessonsRepository.save(lesson);
    return this.sectionsRepository.findOne({
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
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    return this.lessonsRepository.remove(lesson);
  }

  async uploadContent(id: string, content: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_COURSE');

    const lesson = await this.lessonsRepository.findOne({
      where: { id },
    });

    const contentData = await this.cloudinaryService.uploadVideo(
      content,
      folder,
    );

    lesson.contentUrl = contentData.secure_url;
    lesson.lessonType = contentData.resource_type;

    await this.lessonsRepository.save(lesson);
    return { url: contentData.secure_url, publicId: contentData.public_id };
  }

  async uploadPdfAndHtmlContnet(id: string, content: Express.Multer.File) {
    const folder = this.configService.get<string>('CLOUDINARY_FOLDER_COURSE');

    const lesson = await this.lessonsRepository.findOne({
      where: { id },
    });

    const contentData = await this.cloudinaryService.uploadFile(
      content,
      folder,
    );

    lesson.contentUrl = contentData.secure_url;
    lesson.lessonType = contentData.resource_type;

    await this.lessonsRepository.save(lesson);
    return { url: contentData.secure_url };
  }

  async streamVideoContent(publicId: string) {
    return this.cloudinaryService.streamVideo(publicId);
  }

  private async getNextLessonIndex(sectionId: string) {
    const lastLesson = await this.lessonsRepository.findOne({
      where: { section: { id: sectionId } },
      order: { index: 'DESC' },
    });

    return lastLesson ? lastLesson.index + 1 : 1;
  }
}
