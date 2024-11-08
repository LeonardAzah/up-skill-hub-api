import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Section extends AbstractEntity<Section> {
  @Column()
  title: string;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.section, {
    cascade: true,
    nullable: true,
  })
  lessons?: Lesson[];
}