import { AbstractEntity } from 'common';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class Notification extends AbstractEntity<Notification> {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
