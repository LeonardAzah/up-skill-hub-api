import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './course.repository';
import { Course } from './entities/course.entity';
import { UsersRepository } from 'users/users.reposisoty';
import { CategoryRepository } from 'category/category.repository';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly usersRepository: UsersRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async create(id: string, createCourseDto: CreateCourseDto) {
    const { categoryId } = createCourseDto;
    const user = await this.usersRepository.findOne({ where: { id } });
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    const course = new Course({ owner: user, category, ...createCourseDto });
    return this.courseRepository.create(course);
  }

  async findAll() {
    return this.courseRepository.find({});
  }

  async findOne(id: string) {
    return this.courseRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.courseRepository.findOneAndUpdate({ id }, updateCourseDto);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id } });
    return this.courseRepository.remove(course);
  }
}
