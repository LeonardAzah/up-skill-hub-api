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
import { IdDto, Roles } from 'common';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('category')
@Roles(Role.ADMIN)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  async save(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.save(createCategoryDto);
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
