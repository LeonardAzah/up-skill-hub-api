import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IdDto } from 'common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async save(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);

    if (createCategoryDto.categoryId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.categoryId },
      });
      category.parent = parentCategory;
    }

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({ relations: ['children'] });
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, name: string) {
    return this.categoryRepository.findOneAndUpdate({ id }, { name });
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return this.categoryRepository.remove(category);
  }
}
