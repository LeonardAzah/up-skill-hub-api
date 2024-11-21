import { AbstractEntity } from 'common';
import { Course } from 'course/entities/course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class Review extends AbstractEntity<Review> {
  @Column({ nullable: true })
  comment: string;

  @Column('float')
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.reviews, { onDelete: 'CASCADE' })
  course: Course;
}
