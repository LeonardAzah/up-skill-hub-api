import { AbstractEntity } from 'common';
import { Course } from 'course/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
