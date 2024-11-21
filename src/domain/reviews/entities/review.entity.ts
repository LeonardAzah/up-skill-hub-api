import { AbstractEntity } from 'common';
import { Course } from 'course/entities/course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class Review extends AbstractEntity<Review> {
  @Column()
  comment: string;

  @Column('decimal', { precision: 2, scale: 1, default: 1 })
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.reviews, { onDelete: 'CASCADE' })
  course: Course;
}
