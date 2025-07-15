import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Section } from './section.entity';
import { LessonType } from 'course/enums/lessons-type.enum';

@Entity()
export class Lesson extends AbstractEntity<Lesson> {
  @Column()
  index: number;

  @Column({ unique: true })
  title: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    nullable: true,
  })
  lessonType: LessonType;

  @Column({ nullable: true })
  contentUrl: string;

  @Column()
  sectionId: string;

  @ManyToOne(() => Section, (section) => section.lessons, {
    onDelete: 'CASCADE',
  })
  section: Section;
}
