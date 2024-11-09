import { Injectable } from '@nestjs/common';
import { LessonsRepository } from './lesson.repository';
import { CreateLessonDto } from 'course/dto/create-lesson.dto';
import { SectionsRepository } from 'course/sections/section.repository';
import { Lesson } from 'course/entities/lesson.entity';
import { UpdateLessonDto } from 'course/dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly sectionsRepository: SectionsRepository,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const lesson = new Lesson(createLessonDto);
    return this.lessonsRepository.create(lesson);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    return this.lessonsRepository.findOneAndUpdate({ id }, updateLessonDto);
  }

  async remove(id: string) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    return this.lessonsRepository.remove(lesson);
  }
}
