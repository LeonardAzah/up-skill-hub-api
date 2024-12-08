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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/roles/enums/roles.enum';
import { IdDto } from 'common';

@ApiTags('category')
@Roles(Role.ADMIN)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.categoryService.remove(id);
  }
}
