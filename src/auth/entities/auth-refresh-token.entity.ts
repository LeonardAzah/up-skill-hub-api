import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';

export class AuthRefreshToken {
  @PrimaryColumn()
  refreshtoken: string;

  @Column()
  expiresAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
