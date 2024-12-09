import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IdDto, Role, Roles } from 'common';
import { ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { UpdateSectionDto } from 'course/sections/dto/update-section.dto';
import { RemoveSectionDto } from './dto/remove-section.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { ReorderSectionsDto } from './dto/re-order-section.dto';

@ApiTags('sections')
@Roles(Role.INSTRUCTOR)
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post(':id')
  async save(
    @Body() createSectionDto: CreateSectionDto,
    @Param() { id }: IdDto,
  ) {
    return this.sectionsService.save(id, createSectionDto);
  }

  @Patch(':id/reorder')
  async reorderSections(
    @Param('id') { id }: IdDto,
    @Body() { newOrder }: ReorderSectionsDto,
  ) {
    return this.sectionsService.reorderSections(id, newOrder);
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
