import { AbstractEntity } from 'common';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart extends AbstractEntity<Cart> {
  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @Column({ type: 'decimal', default: 0 })
  total: number;
}
