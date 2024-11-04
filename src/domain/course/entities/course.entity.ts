import { AbstractEntity } from 'common';
import { Level } from 'course/enums/level.enum';
import { Status } from 'course/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Category } from './category.entity';

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
    enum: Level,
    enumName: 'course_level',
  })
  level: Level[];

  @Column()
  price: number;

  @Column()
  discountPrice: number;

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.course, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'instructorId' })
  user: User;

  @Column()
  instructorId: string;

  @Column()
  categoryId: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  promoVideoUrl: string;

  @Column()
  seoMetadata: JSON;

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
