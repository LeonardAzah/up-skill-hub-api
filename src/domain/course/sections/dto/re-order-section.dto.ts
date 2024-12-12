import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class ReorderSectionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(5, { each: true })
  newOrder: string[];
}
