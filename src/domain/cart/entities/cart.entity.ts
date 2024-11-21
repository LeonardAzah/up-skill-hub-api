import { AbstractEntity } from 'common';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Cart extends AbstractEntity<Cart> {
  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  items: CartItem[];

  @Column({ type: 'decimal', default: 1 })
  total: number;
}
