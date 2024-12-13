import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'common/enums/roles.enum';
import { IdDto, Public, Roles } from 'common';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  async save(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.save(createCategoryDto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get()
  async findOne(@Body() { id }: IdDto) {
    return this.categoryService.findOne(id);
  }

  @Patch()
  async update(@Body() { id, name }: UpdateCategoryDto) {
    return this.categoryService.update(id, name);
  }

  @Delete()
  async remove(@Body() { id }: IdDto) {
    return this.categoryService.remove(id);
  }
}
