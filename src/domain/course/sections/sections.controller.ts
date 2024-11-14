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
import { RemoveSectionDto } from './dto/remove-section.dto';

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

  @Patch()
  async update(@Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.upadte(updateSectionDto);
  }

  @Delete()
  async remove(@Body() { id }: RemoveSectionDto) {
    return this.sectionsService.remove(id);
  }
}
