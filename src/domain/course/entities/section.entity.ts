import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Section extends AbstractEntity<Section> {
  @Column()
  index: number;

  @Column({ unique: true })
  title: string;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.section, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  lessons?: Lesson[];
}
