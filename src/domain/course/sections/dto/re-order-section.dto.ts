import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class ReorderSectionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID()
  newOrder: string[];
}
