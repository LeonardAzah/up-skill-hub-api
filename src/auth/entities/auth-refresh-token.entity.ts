import { AbstractEntity, AbstractRepository } from 'common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class AuthRefreshToken extends AbstractEntity<AuthRefreshToken> {
  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
