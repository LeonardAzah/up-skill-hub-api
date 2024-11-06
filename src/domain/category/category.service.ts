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

    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      category.parent = parentCategory;
    }

    return this.categoryRepository.create(category);
  }

  async findAll() {
    return this.categoryRepository.find({ relations: ['children'] });
  }

  async findOne(id: string) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['children'],
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.parentId) {
      await this.categoryRepository.findOne({
        where: { parentId: updateCategoryDto.parentId },
      });
    }
    return this.categoryRepository.findOneAndUpdate({ id }, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return this.categoryRepository.remove(category);
  }
}
