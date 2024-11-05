import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    return this.categoryRepository.create(category);
  }

  async findAll() {
    return this.categoryRepository.find({});
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.findOneAndUpdate({ id }, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return this.categoryRepository.remove(category);
  }
}
