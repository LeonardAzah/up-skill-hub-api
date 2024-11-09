import { Injectable } from '@nestjs/common';
import { LessonsRepository } from './lesson.repository';
import { CreateLessonDto } from 'course/dto/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly lessonsRepository: LessonsRepository) {}

  async create(createLessonDto: CreateLessonDto) {}
}
