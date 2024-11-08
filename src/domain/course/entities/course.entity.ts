import { Category } from 'category/entities/category.entity';
import { AbstractEntity, CourseLevel, Features, Language } from 'common';
import { Status } from 'course/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Section } from './section.entity';

@Entity()
export class Course extends AbstractEntity<Course> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Language,
    enumName: 'language',
  })
  language: Language;

  @Column({ nullable: true })
  duration?: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    enumName: 'course_levels',
    nullable: true,
  })
  course_level?: CourseLevel[];

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  price?: number;

  @Column({ type: 'float', nullable: true })
  ratings: number;

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

  @OneToMany(() => Section, (section) => section.course, {
    cascade: true,
    nullable: true,
  })
  sections?: Section[];

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
