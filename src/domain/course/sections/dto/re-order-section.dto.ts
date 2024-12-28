import { IsUUID } from 'class-validator';

export class ReorderSectionsDto {
  @IsUUID()
  section1: string;

  @IsUUID()
  section2: string;
}
