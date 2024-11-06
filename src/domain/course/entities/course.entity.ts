import { Category } from 'category/entities/category.entity';
import { AbstractEntity } from 'common';
import { Levels } from 'course/enums/level.enum';
import { Status } from 'course/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class Course extends AbstractEntity<Course> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  language: string;

  @Column({
    type: 'enum',
    enum: Levels,
    enumName: 'course_levels',
    nullable: true,
  })
  levels?: Levels[];

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  price?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  discountPrice?: number;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.ownedCourses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;

  @ManyToMany(() => User, (user) => user.enrolledCourses, { nullable: true })
  enrolledStudents?: User[];

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  promoVideoUrl?: string;

  @Column({
    type: 'enum',
    enum: Status,
    enumName: 'status_enum',
    default: Status.DRAFT,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
