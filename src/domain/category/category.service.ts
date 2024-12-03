import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async save(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);

    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOneById({
        where: { id: createCategoryDto.parentId },
      });
      category.parent = parentCategory;
    }

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({ relations: ['children'] });
  }

  async findOneById(id: string) {
    return this.categoryRepository.findOneById({
      where: { id },
      relations: ['children'],
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.parentId) {
      await this.categoryRepository.findOneById({
        where: { parentId: updateCategoryDto.parentId },
      });
    }
    return this.categoryRepository.findOneAndUpdate({ id }, updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneById({
      where: { id },
    });
    return this.categoryRepository.remove(category);
  }
}
