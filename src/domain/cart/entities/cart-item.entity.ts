import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Course } from 'course/entities/course.entity';

@Entity()
export class CartItem extends AbstractEntity<CartItem> {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Course, (course) => course.id, { eager: true })
  course: Course;

  @Column({ type: 'decimal', default: 0 })
  price: number;
}
