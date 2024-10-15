import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { FilteringService } from './filtering.service';

@Module({
  providers: [PaginationService, FilteringService],
  exports: [PaginationService, FilteringService],
})
export class QueryingModule {}
