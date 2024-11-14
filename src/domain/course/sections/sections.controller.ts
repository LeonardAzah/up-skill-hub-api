import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IdDto } from 'common';
import { ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from 'course/sections/dto/create-section.dto';
import { UpdateSectionDto } from 'course/sections/dto/update-section.dto';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post(':id')
  async create(
    @Body() createSectionDto: CreateSectionDto,
    @Param() { id }: IdDto,
  ) {
    return this.sectionsService.create(id, createSectionDto);
  }

  @Get(':id')
  async find(@Param() { id }: IdDto) {
    return this.sectionsService.find(id);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.upadte(id, updateSectionDto);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    return this.sectionsService.remove(id);
  }
}
