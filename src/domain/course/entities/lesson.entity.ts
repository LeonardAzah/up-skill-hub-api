import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Section } from './section.entity';
import { LessonType } from 'course/enums/lessons-type.enum';

@Entity()
export class Lesson extends AbstractEntity<Lesson> {
  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: LessonType,
  })
  lessontype: LessonType;

  @Column()
  contentUrl: string;

  @ManyToOne(() => Section, (section) => section.lessons, {
    onDelete: 'CASCADE',
  })
  section: Section;
}
