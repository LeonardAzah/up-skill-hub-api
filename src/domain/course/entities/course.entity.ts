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
  })
  levels: Levels[];

  @Column()
  price: number;

  @Column()
  discountPrice: number;

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
  @JoinColumn({ name: 'instructorId' })
  owner: User;

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  enrolledStudents: User[];

  @Column()
  instructorId: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  promoVideoUrl: string;

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
